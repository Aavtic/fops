# Judge for testing python code against provided test cases.

## Command

### TODO!
Here the program gets its input by using three different ways, lol. Try generalizing and having a single mode of input for clarity.

### For Python
PYTHONPATH=<sourcepath> python3 judge.py --output <output file>

## Input

### Pass the problem template through `stdin`.

I decided to pass the `problem template` through the stdin instead of passing it as an arugment due to size limitation of maximum arguments which can be passed as an argument.
Plus by passing the `problem template` through the stdin it should be easier to serialize the json

<!-- ### 1. source file -->
<!---->
<!-- The source file which contains the code to be tested against provided test cases -->

### 2. problem_details

the details of the problem which would be created at the time of problem cration.
this should be passed as json to the stdin of the `judge.py` process.

Example:
{
    title: "Fibonacci",
    description: "Fibo!",
    function_name: "fibonacci"
    input_type: "Integer",
    output_type: "Integer",
    input_output: [
        [[0], 1],
        [[1], 1],
        [[2], 2],
        [[5], 120],
    ]
}

#### Input_output
This contains a list of all the pre defined input and their expected outputs
This is used to test the problem against all the inputs and check against the generated output.
input_output: [
    [[0], 1],
    [[1], 1],
    [[2], 2],
    [[5], 120],
]
This means there can be multiple input to a program and also multiple output to the program

#### Supported Types

1. int,
2. bool,
3. str,
4. List[str],
5. List[int],
6. List[float],
7. List[bool],

## Usage

call the judge. pass the following arguments

`--source`: Python source file
This is the python source file which contains code to be tested
All the test files will contain a similar class or function which is the starting point for execution.
which in this case is `Solution`.

Example code file:
```python
class Solution:
    def fibonacci(n: int) -> int:
        ...
```

`--problem_details`: The problem template file which contains all details of the problem
This is a json string passed as an argument which has all the details as mentioned above

`--output`: The output file to output the execution status of the file

## Output Format

The output will be a file with the following format. This file contains details about the execution status of the program

```json
{
        "status": Pass | Fail | URCodeErrorLOL | URCodeDontReturnAnything | Cooked,
        "info": {
            # Total (for all Test cases); Only on status Pass
            "execution_time": "<int>ms" | "TLE",
            # Average (for all test cases); Only on status Pass
            "average_time": "<int>ms"
            # Incase of status Pass
            "Pass": [
                {
                    "expected": <exp>,
                    "got": <got>,
                    "input": <input>,
                    "ms": <execution time>,
                }
            ]
            # Incase of status: Fail
            "Fail": {
                "ex": "",    # Expected output
                "got": "",   # Got output
                "input": "", # Input
            }

            # Incase of status URCodeErrorLOL
            "URCodeErrorLOL": {
                "error": "",
            }

            # Incase of Cooked
            "Cooked": {
                error: ""
            }
    }
}
} ```

Here the status `Cooked` is used to respond that there was some issue internally in the server which is not recoverable. The caller can thus know and handle this accordingly.
