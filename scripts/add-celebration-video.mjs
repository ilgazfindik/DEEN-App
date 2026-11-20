#!/usr/bin/env node
// Usage: node scripts/add-celebration-video.mjs <animal> <event> <source-video>
// Transcodes to a portrait 720x1280 H.264/AAC mp4 (sources are 576-720 px wide, so this is their native sharpness) + poster and registers it in assets/videos/manifest.json.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const [animal,event,src]=process.argv.slice(2);
if(!animal||!event||!src){console.error('usage: add-celebration-video.mjs <animal> <event> <source>');process.exit(1)}
if(!/^[a-z]+$/.test(animal)||!/^[a-z0-9_]+$/.test(event)){console.error('bad animal/event name');process.exit(1)}
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const dir=path.join(root,'assets/videos',animal);fs.mkdirSync(dir,{recursive:true});
const out=path.join(dir,event+'.mp4'),poster=path.join(dir,event+'.jpg');
execFileSync('ffmpeg',['-y','-v','error','-i',src,'-vf','scale=720:1280:flags=lanczos:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1','-r','30','-c:v','libx264','-crf','21','-preset','slow','-profile:v','high','-level','4.1','-pix_fmt','yuv420p','-movflags','+faststart','-c:a','aac','-b:a','96k','-ac','2',out]);
execFileSync('ffmpeg',['-y','-v','error','-ss','0.3','-i',out,'-frames:v','1','-q:v','5',poster]);
const mp=path.join(root,'assets/videos/manifest.json');
const m=fs.existsSync(mp)?JSON.parse(fs.readFileSync(mp,'utf8')):{};
(m[event]??={})[animal]={src:`assets/videos/${animal}/${event}.mp4`,poster:`assets/videos/${animal}/${event}.jpg`,bytes:fs.statSync(out).size};
fs.writeFileSync(mp,JSON.stringify(m,null,1)+'\n');
console.log(animal,event,fs.statSync(out).size,'bytes');
