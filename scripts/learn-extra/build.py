#!/usr/bin/env python3
"""Builds assets/learn/extra-questions.js from the authored files in scripts/learn-extra/units/*.py.

Each unit file defines UNIT (e.g. 'U13'), SLUG, TITLES ({stage no: title}) and Q, a list of tuples:
  ('mc', stage, concept, topic, level, question, answer, [3 wrong], explanation)      multiple choice
  ('tf', stage, concept, topic, level, statement, True|False, explanation)             true / false
  ('fb', ...same as mc, question contains ___)                                         fill in the blank
  ('mi', ...same as mc, question contains ___)                                         missing item
  ('sc', ...same as mc)                                                                scenario
  ('es', ...same as mc, question is the faulty statement, answer its correction)       error spotting
  ('sr', ...same as mc)                                                                speed review
  ('mt', stage, concept, topic, level, intro, [(left, right) x4], explanation)         matching
  ('pr', stage, concept, topic, level, question with ___, answer, explanation)         progressive recall
level: 'e' easy, 'm' medium, 'h' hard.
Only Turkish uses these questions (the other languages keep their translated banks), see segment 13 of the release.
Run: python3 scripts/learn-extra/build.py
"""
import hashlib, importlib.util, json, pathlib, random, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
UNITS_DIR = pathlib.Path(__file__).resolve().parent / 'units'
LEVEL = {'e': 'easy', 'm': 'medium', 'h': 'hard'}
WORLD = {'U03': 'foundations'}
PREFIX = {'mc': '', 'tf': 'Doğru mu, yanlış mı? ', 'fb': 'Boşluğu tamamla: ', 'mi': 'Eksik kavramı seç: ',
          'sr': 'Hızlı tekrar: ', 'pr': 'İpucu olmadan tamamla: '}
COG = {'mc': 'recognition', 'tf': 'recognition', 'fb': 'recall', 'mi': 'recognition', 'sc': 'application',
       'es': 'application', 'sr': 'recall', 'mt': 'recognition', 'pr': 'recall'}
KIND = {'mc': 'multiple_choice', 'tf': 'true_false', 'fb': 'fill_blank', 'mi': 'missing_item', 'sc': 'scenario',
        'es': 'error_spotting', 'sr': 'speed_review', 'mt': 'matching', 'pr': 'progressive_recall'}
SOURCE = ('Diyanet İşleri Başkanlığı, İlmihal ve Din İşleri Yüksek Kurulu görüşleri; Kur’an-ı Kerîm; '
          'REQUIRES_EXPERT_VERIFICATION')


def load(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def shuffled(seed, items):
    rng = random.Random(int(hashlib.sha256(seed.encode()).hexdigest()[:12], 16))
    out = list(items)
    rng.shuffle(out)
    return out


def build(mod):
    out, counters, texts = [], {}, set()
    for row in mod.Q:
        kind, stage, cid, topic, level = row[0], row[1], row[2], row[3], row[4]
        n = counters[stage] = counters.get(stage, 100) + 1
        qid = 'DEEN-%s-S%02d-X%03d' % (mod.UNIT, stage, n - 100)
        sid = '%s-S%02d' % (mod.UNIT, stage)
        q = {
            'id': qid, 'world': WORLD.get(mod.UNIT, 'worship'), 'unit': mod.SLUG, 'stage_id': sid,
            'stage_title': mod.TITLES[stage], 'concept_id': 'x_' + cid,
            'variant_group_id': 'VG-%s-X-%s-%03d' % (sid, cid, n - 100), 'topic': topic,
            'activity_type': KIND[kind], 'difficulty': LEVEL[level], 'cognitive_level': COG[kind],
            'question_tr': None, 'options_tr': None, 'correct_answer': None, 'explanation_tr': None,
            'pairs': None, 'items': None, 'correct_order': None, 'asset_requirement': None,
            'source_reference': SOURCE, 'source_urls': [], 'madhhab_scope': 'diyanet_hanafi',
            'verification_status': 'needs_review',
            'source_audit_status': 'authored_from_standard_sources_needs_expert_review',
            'source_release_ready': False, 'religious_release_ready': False,
            'tags': ['extra', 'tr_only', mod.UNIT.lower(), KIND[kind], cid], 'tr_only': True,
        }
        if kind in ('mc', 'fb', 'mi', 'sc', 'es', 'sr'):
            text, ans, wrong, expl = row[5], row[6], row[7], row[8]
            assert len(wrong) == 3 and ans not in wrong and len(set(wrong)) == 3, (qid, text)
            q['question_tr'] = PREFIX.get(kind, '') + text
            if kind == 'es':
                q['question_tr'] = '“%s” ifadesindeki hata hangi seçenekle düzeltilir?' % text
            q['options_tr'] = shuffled(qid, [ans] + list(wrong))
            q['correct_answer'], q['explanation_tr'] = ans, expl
            if kind in ('fb', 'mi'):
                assert '___' in text, (qid, text)
        elif kind == 'tf':
            text, val, expl = row[5], row[6], row[7]
            q['question_tr'] = PREFIX['tf'] + text
            q['options_tr'] = ['Doğru', 'Yanlış']
            q['correct_answer'] = 'Doğru' if val else 'Yanlış'
            q['explanation_tr'] = expl
        elif kind == 'mt':
            intro, pairs, expl = row[5], row[6], row[7]
            assert len(pairs) == 4 and len({p[0] for p in pairs}) == 4 and len({p[1] for p in pairs}) == 4, qid
            q['question_tr'] = intro + ' ' + ', '.join(p[0] for p in pairs[:-1]) + ' ve ' + pairs[-1][0] + '.'
            q['pairs'] = [{'left': a, 'right': b} for a, b in pairs]
            q['explanation_tr'] = expl
        elif kind == 'pr':
            text, ans, expl = row[5], row[6], row[7]
            assert '___' in text, (qid, text)
            q['question_tr'] = PREFIX['pr'] + text
            q['correct_answer'], q['explanation_tr'] = ans, expl
        key = q['question_tr']
        assert key not in texts, ('duplicate question text', key)
        texts.add(key)
        for k in ('options_tr', 'correct_answer'):
            pass
        out.append(q)
    return out


def main():
    allq = []
    for path in sorted(UNITS_DIR.glob('u*.py')):
        mod = load(path)
        qs = build(mod)
        print(mod.UNIT, len(qs), 'questions;', 'by stage', {s: sum(1 for q in qs if q['stage_id'].endswith('S%02d' % s)) for s in range(1, 8)})
        allq.extend(qs)
    ids = [q['id'] for q in allq]
    assert len(ids) == len(set(ids))
    body = json.dumps(allq, ensure_ascii=False, separators=(',', ':'))
    header = ('/* Extra Learn-path questions for the units whose bank asks fewer distinct facts than a unit has places '
              '(units 3 and 11-15). Turkish only: the other languages keep their translated banks. Generated by '
              'scripts/learn-extra/build.py from scripts/learn-extra/units/*.py; do not edit by hand. */\n')
    js = header + '(()=>{\n \'use strict\';\n if(window.DEEN_EXTRA_QUESTIONS)return;\n window.DEEN_EXTRA_QUESTIONS=Object.freeze(' + body + ');\n})();\n'
    dest = ROOT / 'assets' / 'learn' / 'extra-questions.js'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(js, encoding='utf-8')
    print('wrote', dest.relative_to(ROOT), len(allq), 'questions', len(js), 'bytes')
    lines = ['# Yeni öğrenme yolu soruları — inceleme listesi', '',
             'Bu liste `assets/learn/extra-questions.js` dosyasındaki soruların okunabilir halidir (yalnızca Türkçede kullanılır).',
             'Tüm sorular `needs_review` durumundadır: yayın öncesi bir din görevlisi / ilahiyatçı tarafından gözden geçirilmelidir.',
             'Kaynak: Diyanet İşleri Başkanlığı ilmihali ve Din İşleri Yüksek Kurulu görüşleri, Kur’an-ı Kerîm, sahih hadis kaynakları.', '']
    by = {}
    for q in allq:
        by.setdefault(q['stage_id'][:3], []).append(q)
    for unit, qs in by.items():
        lines += ['## %s — %s (%d soru)' % (unit, qs[0]['unit'], len(qs)), '']
        for q in qs:
            lines.append('**%s** · %s · %s' % (q['id'], q['stage_title'], q['activity_type']))
            lines.append('- Soru: ' + q['question_tr'])
            if q['activity_type'] == 'matching':
                lines.append('- Eşleşmeler: ' + '; '.join('%s → %s' % (p['left'], p['right']) for p in q['pairs']))
            else:
                if q['options_tr']:
                    lines.append('- Seçenekler: ' + ' | '.join(q['options_tr']))
                lines.append('- Doğru cevap: ' + q['correct_answer'])
            lines.append('- Açıklama: ' + q['explanation_tr'])
            lines.append('')
    (ROOT / 'scripts' / 'learn-extra' / 'REVIEW.md').write_text('\n'.join(lines), encoding='utf-8')
    print('wrote scripts/learn-extra/REVIEW.md')


if __name__ == '__main__':
    sys.exit(main())
