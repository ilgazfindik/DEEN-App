import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const script='scripts/quran/align-word-timings.mjs';
const registry='assets/quran/audio/word-timings.json';
function cli(overrides={}){
  return spawnSync(process.execPath,[script],{
    encoding:'utf8',timeout:12000,
    env:{...process.env,ELEVENLABS_API_KEY:'',ALIGN_DRY_RUN:'1',
      FORCE_ALIGNMENT:'0',ALIGN_ONLY:'',ALIGN_MAX:'',...overrides}});
}
function plan(output){
  const line=output.stdout.split('\n').find(x=>x.startsWith('ALIGN_PLAN '));
  assert(line,output.stderr||'No alignment plan');
  return JSON.parse(line.slice('ALIGN_PLAN '.length));
}
test('Fatiha and Ikhlas eleven-ayah dry run does not require API credentials or writes',()=>{
  const original=readFileSync(registry,'utf8');
  const result=cli({ALIGN_ONLY:'fatiha,ikhlas',ALIGN_MAX:'11'});
  assert.equal(result.status,0,result.stderr);
  const x=plan(result);
  assert.deepEqual(x.keys,[
    ...Array.from({length:7},(_,i)=>'fatiha:'+(i+1)),
    ...Array.from({length:4},(_,i)=>'ikhlas:'+(i+1))]);
  assert.equal(x.selected,11);
  assert.equal(x.queued,11);
  assert.equal(x.noNetworkOrWrites,true);
  assert.equal(x.releaseReady,false);
  assert.equal(readFileSync(registry,'utf8'),original);
});
test('limit the requested batch to two pending ayahs',()=>{
  const result=cli({ALIGN_ONLY:'fatiha,ikhlas',ALIGN_MAX:'2'});
  assert.equal(result.status,0,result.stderr);
  const x=plan(result);
  assert.deepEqual(x.keys,['fatiha:1','fatiha:2']);
  assert.equal(x.pending,11);
  assert.equal(x.remainingAfterQueue,9);
});
test('select exactly one ayah',()=>{
  const result=cli({ALIGN_ONLY:'ikhlas:3'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(plan(result).keys,['ikhlas:3']);
});
test('reject nonexistent and malformed selectors',()=>{
  for(const value of ['fatiha:99','fatiha,','fatiha,,ikhlas','../secret']){
    const r=cli({ALIGN_ONLY:value});
    assert.notEqual(r.status,0,value);
    assert.match(r.stderr,/ALIGN_ONLY/);
  }
});
test('reject unsafe batch limits before API',()=>{
  for(const value of ['0','-1','1.5','Infinity','99999']){
    const r=cli({ALIGN_MAX:value});
    assert.notEqual(r.status,0,value);
    assert.match(r.stderr,/ALIGN_MAX/);
  }
});
test('real execution without API key cannot write data',()=>{
  const original=readFileSync(registry,'utf8');
  const r=cli({ALIGN_DRY_RUN:'0',ALIGN_ONLY:'fatiha',ALIGN_MAX:'1'});
  assert.notEqual(r.status,0);
  assert.match(r.stderr,/ELEVENLABS_API_KEY required/);
  assert.equal(readFileSync(registry,'utf8'),original);
});
