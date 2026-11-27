"""Translations keyed by concept id instead of row order (used by the new units, U16+).

A unit's _i18n file writes {lang: {concept_id: row}} and calls aligned(__file__, rows); the result is the
I18N = {lang: [row, ...]} list that build.py expects, in the order of the unit's Q, with every concept present.
"""
import importlib.util
import pathlib

SHAPE = {'mc': 5, 'fb': 5, 'mi': 5, 'sc': 5, 'es': 5, 'sr': 5, 'tf': 3, 'mt': 4, 'pr': 4}


def aligned(i18n_file, rows):
    path = pathlib.Path(i18n_file)
    unit_path = path.with_name(path.name.replace('_i18n', ''))
    spec = importlib.util.spec_from_file_location(unit_path.stem + '_src', unit_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    out = {}
    for lang, table in rows.items():
        cids = [r[2] for r in mod.Q]
        assert len(set(cids)) == len(cids), (mod.UNIT, 'duplicate concept ids')
        missing = [c for c in cids if c not in table]
        extra = [c for c in table if c not in cids]
        assert not missing and not extra, (mod.UNIT, lang, 'missing', missing, 'extra', extra)
        lst = []
        for r in mod.Q:
            row = table[r[2]]
            assert len(row) == SHAPE[r[0]], (mod.UNIT, lang, r[2], r[0], len(row))
            if r[0] == 'mt':
                assert len(row[1]) == 4, (mod.UNIT, lang, r[2])
            lst.append(row)
        out[lang] = lst
    return out
