import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


analysis = load(ROOT / "projects/experimentation/analyze.py", "analysis")
validator = load(ROOT / "projects/ai-requirements/validate.py", "validator")


class PortfolioChecks(unittest.TestCase):
    def test_experiment_result(self):
        rows, delta, interval = analysis.summarize(ROOT / "projects/experimentation/data.csv")
        self.assertAlmostEqual(rows["control"]["rate"], .078)
        self.assertGreater(delta, 0)
        self.assertLess(interval[0], interval[1])

    def test_requirements_reject_missing_property(self):
        data = json.loads((ROOT / "projects/ai-requirements/example_request.json").read_text())
        self.assertEqual(validator.validate(data), [])
        del data["example_payload"]["session_id"]
        self.assertIn("example_payload: missing session_id", validator.validate(data))


if __name__ == "__main__":
    unittest.main()
