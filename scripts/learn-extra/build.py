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
Translations: scripts/learn-extra/units/<unit>_i18n.py defines I18N = {'en': [...], 'de': [...], 'fr': [...], 'ar': [...]}, each list
aligned with Q (same order, same kinds). Row shapes (the last item is the topic label in that language):
  mc, fb, mi, sc, es, sr: (text, answer, [3 wrong], explanation, topic)      (same logical order as the Turkish row)
  tf:                    (statement, explanation, topic)
  mt:                    (intro, [(left, right) x4], explanation, topic)
  pr:                    (text with ___, answer, explanation, topic)
The generator writes assets/learn/extra-questions.<lang>.json (loaded only when that language is active, checked against a
SHA-256 embedded in extra-questions.js). A question without a translation is simply not offered in that language.
Run: python3 scripts/learn-extra/build.py
"""
import hashlib, importlib.util, json, pathlib, random, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
UNITS_DIR = pathlib.Path(__file__).resolve().parent / 'units'
LEVEL = {'e': 'easy', 'm': 'medium', 'h': 'hard'}
WORLD = {'U06': 'foundations', 'U07': 'foundations', 'U04': 'foundations', 'U01': 'foundations', 'U02': 'foundations', 'U03': 'foundations', 'U05': 'foundations'}
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


LANGS = ('en', 'de', 'fr', 'ar')
WORDS = {
    'en': {'tf': 'True or false? ', 'fb': 'Fill in the blank: ', 'mi': 'Choose the missing term: ', 'sr': 'Quick review: ',
           'pr': 'Complete without a hint: ', 'es': '“%s” — which option corrects the mistake in this statement?',
           'and': ' and ', 'comma': ', ', 'true': 'True', 'false': 'False'},
    'de': {'tf': 'Richtig oder falsch? ', 'fb': 'Ergänze die Lücke: ', 'mi': 'Wähle den fehlenden Begriff: ', 'sr': 'Schnelle Wiederholung: ',
           'pr': 'Ergänze ohne Hinweis: ', 'es': '„%s“ – Mit welcher Option wird der Fehler in dieser Aussage korrigiert?',
           'and': ' und ', 'comma': ', ', 'true': 'Richtig', 'false': 'Falsch'},
    'fr': {'tf': 'Vrai ou faux ? ', 'fb': 'Complète le blanc : ', 'mi': 'Choisis le terme manquant : ', 'sr': 'Révision rapide : ',
           'pr': 'Complète sans indice : ', 'es': '« %s » — quelle option corrige l’erreur de cette affirmation ?',
           'and': ' et ', 'comma': ', ', 'true': 'Vrai', 'false': 'Faux'},
    'ar': {'tf': 'صح أم خطأ؟ ', 'fb': 'أكمل الفراغ: ', 'mi': 'اختر المفهوم الناقص: ', 'sr': 'مراجعة سريعة: ',
           'pr': 'أكمل دون تلميح: ', 'es': '«%s» — أي خيار يصحّح الخطأ في هذه العبارة؟',
           'and': ' و', 'comma': '، ', 'true': 'صحيح', 'false': 'خطأ'},
}
STAGE_TITLES = {}


def translate_unit(mod, qs, lang, rows):
    """Returns {id: entry} for one unit and language; entries follow the shape the language's adapter already reads."""
    w = WORDS[lang]
    assert len(rows) == len(mod.Q), (mod.UNIT, lang, len(rows), len(mod.Q))
    out = {}
    for src, q, row in zip(mod.Q, qs, rows):
        kind = src[0]
        topic = row[-1]
        if kind in ('mc', 'fb', 'mi', 'sc', 'es', 'sr'):
            text, ans, wrong, expl = row[0], row[1], row[2], row[3]
            assert len(wrong) == 3 and ans not in wrong and len(set(wrong)) == 3, (q['id'], lang)
            question = w['es'] % text if kind == 'es' else w.get(kind, '') + text
            logical_tr = [src[6]] + list(src[7])
            mapping = dict(zip(logical_tr, [ans] + list(wrong)))
            options = [mapping[o] for o in q['options_tr']]
            correct = ans
            pairs = None
            if kind in ('fb', 'mi'):
                assert text.count('___') == 1, (q['id'], lang, text)
        elif kind == 'tf':
            text, expl = row[0], row[1]
            question = w['tf'] + text
            options = [w['true'], w['false']]
            correct = w['true'] if src[6] else w['false']
            pairs = None
        elif kind == 'mt':
            intro, prs, expl = row[0], row[1], row[2]
            assert len(prs) == 4, (q['id'], lang)
            names = [a for a, _ in prs]
            question = intro + ' ' + w['comma'].join(names[:-1]) + w['and'] + names[-1] + '.'
            options, correct = None, None
            pairs = [{'left': a, 'right': b} for a, b in prs]
        elif kind == 'pr':
            text, ans, expl = row[0], row[1], row[2]
            assert text.count('___') == 1, (q['id'], lang, text)
            question = w['pr'] + text
            options, correct, pairs = None, ans, None
        else:
            raise AssertionError(kind)
        assert question.strip() and expl.strip() and topic.strip(), (q['id'], lang)
        source = {k: q[k] for k in ('question_tr', 'explanation_tr', 'activity_type', 'options_tr', 'correct_answer')}
        source.update({'pairs': q['pairs'], 'items': None, 'correct_order': None})
        if lang == 'ar':
            entry = {
                'activity_type': q['activity_type'], 'question_ar': question, 'explanation_ar': expl,
                'correct_answer_ar': correct, 'source_question_tr': q['question_tr'],
                'source_correct_answer_tr': q['correct_answer'], 'source_options_tr': q['options_tr'],
                'source_pairs_tr': q['pairs'], 'source_items_tr': None, 'source_correct_order_tr': None,
                'source_ref': q['source_reference'], 'expert_approved': False,
                'status': 'model_translated_pending_expert_review', 'topic_ar': topic,
            }
            if q['activity_type'] == 'matching':
                entry['pairs_ar'] = pairs
            elif options is not None:
                entry['options_ar'] = options
            out[q['id']] = entry
        else:
            display = {'question_tr': question, 'explanation_tr': expl, 'activity_type': q['activity_type'],
                       'options_tr': options, 'correct_answer': correct, 'pairs': pairs, 'items': None,
                       'correct_order': None, 'topic': topic}
            out[q['id']] = [{'source': source, 'display': display}]
    return out


def main():
    allq = []
    tr = {lang: {} for lang in LANGS}
    for path in sorted(UNITS_DIR.glob('u??.py')):
        mod = load(path)
        qs = build(mod)
        i18n_path = UNITS_DIR / (path.stem + '_i18n.py')
        if i18n_path.exists():
            data = load(i18n_path).I18N
            for lang in LANGS:
                if lang in data:
                    tr[lang].update(translate_unit(mod, qs, lang, data[lang]))
        print(mod.UNIT, len(qs), 'questions;', 'by stage', {s: sum(1 for q in qs if q['stage_id'].endswith('S%02d' % s)) for s in range(1, 8)})
        allq.extend(qs)
    ids = [q['id'] for q in allq]
    assert len(ids) == len(set(ids))
    body = json.dumps(allq, ensure_ascii=False, separators=(',', ':'))
    hashes = {}
    for lang in LANGS:
        if not tr[lang]:
            continue
        pack = {'schema_version': 1, 'locale': lang, 'expert_approved': False, 'verified_by_religious_expert': False,
                'status': 'model_translated_pending_expert_review', 'count': len(tr[lang]), 'translations': tr[lang]}
        data = json.dumps(pack, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        (ROOT / 'assets' / 'learn').mkdir(parents=True, exist_ok=True)
        (ROOT / 'assets' / 'learn' / ('extra-questions.%s.json' % lang)).write_bytes(data)
        hashes[lang] = hashlib.sha256(data).hexdigest()
        print('  ', lang, len(tr[lang]), 'translated questions')
    header = ('/* Extra Learn-path questions for the units whose bank asks fewer distinct facts than a unit has places '
              '(units 3 and 11-15). Turkish only: the other languages keep their translated banks. Generated by '
              'scripts/learn-extra/build.py from scripts/learn-extra/units/*.py; do not edit by hand. */\n')
    loader = (" const HASHES=" + json.dumps(hashes) + ";\n"
              " window.DEEN_EXTRA_I18N=Object.create(null);\n const jobs=Object.create(null);\n"
              " // Loads the translations of one language (not Turkish) on demand and checks them against the SHA-256 above.\n"
              " window.DEEN_EXTRA_I18N_LOAD=lang=>{\n"
              "  if(!HASHES[lang])return Promise.resolve(null);\n"
              "  if(window.DEEN_EXTRA_I18N[lang])return Promise.resolve(window.DEEN_EXTRA_I18N[lang]);\n"
              "  return jobs[lang]||(jobs[lang]=(async()=>{\n"
              "   try{\n"
              "    const v=window.__DEEN_DEPLOY_ID__||'';\n"
              "    const r=await fetch('./assets/learn/extra-questions.'+lang+'.json'+(v?'?v='+encodeURIComponent(v):''),{cache:'no-store'});\n"
              "    if(!r.ok)throw Error('HTTP '+r.status);\n"
              "    const buf=await r.arrayBuffer();\n"
              "    const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',buf))].map(b=>b.toString(16).padStart(2,'0')).join('');\n"
              "    if(digest!==HASHES[lang])throw Error('EXTRA_I18N_HASH:'+lang);\n"
              "    const pack=JSON.parse(new TextDecoder().decode(buf));\n"
              "    if(pack.locale!==lang||pack.expert_approved!==false||!pack.translations)throw Error('EXTRA_I18N_META:'+lang);\n"
              "    window.DEEN_EXTRA_I18N[lang]=pack.translations;return pack.translations;\n"
              "   }catch(e){console.warn('[DEEN extra questions]',lang,String(e&&e.message||e));return null}\n"
              "  })());\n };\n")
    js = header + '(()=>{\n \'use strict\';\n if(window.DEEN_EXTRA_QUESTIONS)return;\n' + loader + ' window.DEEN_EXTRA_QUESTIONS=Object.freeze(' + body + ');\n})();\n'
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
