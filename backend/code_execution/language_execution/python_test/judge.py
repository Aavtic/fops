import argparse
import sys
import json
from datetime import datetime

from response_types import URCodeErrorLOL, Fail, Cooked, Pass


parser = argparse.ArgumentParser(description="Judge for testing python code against provided test cases.")
# parser.add_argument("--source", required=True,
                    # help="Python source file.")
# parser.add_argument("--problem_details", required=True,
                    # help="The problem template file which contains all details of the problem")
parser.add_argument("--output", required=True,
                    help="The output file to output the execution status of the file")


class Judge:
    def __init__(self, problem_details: str, output_file: str):
        # self.source_file = source
        self.problem_details = problem_details
        self.output_file = output_file
        self.output = ""

        self.judge()

    def judge(self):
        problem_details = self.parse_str_to_json(self.problem_details)
        function_name = problem_details["function_name"]
        # "Pass": [
        #     {
        #         "expected": <exp>,
        #         "got": <got>,
        #         "input": <input>,
        #         "ms": <execution time>,
        #     }
        # ]
        execution_informations = list()
        info = {
            "expected": None,
            "got": None,
            "input": None,
            "ms": 0,
        }

        execution_start_time = datetime.now()

        try:
            try:
                from main import Solution as s
            except:
                raise URCodeErrorLOL("No class named Solution found")

            try:
                instance = s()
            except Exception as e:
                raise URCodeErrorLOL(str(e))

            try:
                fn = getattr(instance, function_name)
            except:
                raise URCodeErrorLOL("No function named %s found" % function_name)

            for input_output in problem_details["input_output"]:
                input = input_output[0]
                output = input_output[1]

                start_time = datetime.now()

                try:
                    result = fn(*input)
                except Exception as e:
                    raise URCodeErrorLOL(str(e))

                end_time = datetime.now()
                execution_time = round((end_time - start_time).total_seconds() * 1000, 2)

                if (type(result) != type(output)) or (result != output):
                    raise Fail(expected=output, got=result, input=input)

                info["expected"] = output
                info["got"] = result
                info["input"] = input
                info["ms"] = execution_time

                execution_informations.append(info)


        except URCodeErrorLOL as e:
            self.output = e.to_string()
            self.exit()

        except Fail as e:
            self.output = e.to_string()
            self.exit()

        except Exception as e:
            cooked = Cooked(str(e))
            self.output = cooked.to_string()
            self.exit()

        else:
            execution_end_time = datetime.now()
            execution_ms = round((execution_end_time - execution_start_time).total_seconds() * 1000, 1)
            average_ms = sum([i["ms"] for i in execution_informations]) / len(execution_informations)

            pass_data = Pass(execution_ms, average_ms, execution_informations)
            self.output = pass_data.to_string()
            self.exit()

    def exit(self):
        with open(self.output_file, "w") as f:
            f.write(self.output)

        sys.exit(0)

    def parse_str_to_json(self, input: str):
        return json.loads(input)

def get_stdin() -> str:
    buffer = sys.stdin.read()
    return buffer

if __name__ == "__main__":
    args = parser.parse_args()
    # source = args.source
    # problem_deatils = args.problem_details
    output_file = args.output
    problem_details = get_stdin()
    judge = Judge(problem_details, output_file)
