import random
from fractions import Fraction

def generate_addition_or_subtraction_problem(max_digits=2):
    max_num = 10 ** max_digits - 1
    num1 = random.randint(1, max_num)
    num2 = random.randint(1, max_num)
    operator = random.choice(['+', '-'])
    problem_text = f"{num1} {operator} {num2}"
    if operator == '+':
        answer = num1 + num2
    else:
        answer = num1 - num2
    return problem_text, answer

def generate_division_problem(max_digits=2, rational_answer=True, scale=1, precision=2):
    max_num = 10 ** max_digits - 1
    num1 = random.randint(1, max_num)
    operator = '/'
    
    # Scale the range of num2 based on the specified scale
    num2 = random.randint(1, max_num // scale)
    
    # Ensure num2 is not 0 for division problems
    if operator == '/' and not rational_answer:
        # Ensure whole number division by finding a common divisor
        common_divisor = random.randint(1, min(num1, num2))
        num1 = num1 // common_divisor
        num2 = num2 // common_divisor
    
    problem_text = f"{num1} {operator} {num2}"
    if rational_answer:
        answer = num1/ num2
    else:
        answer = num1 // num2  # Integer division for whole number answer

    # Round the answer to the specified precision
    answer = round(answer, precision)

    return problem_text, answer

def generate_multiplication_problem(max_digits=2, scale=1):
    max_num = 10 ** max_digits - 1
    num1 = random.randint(1, max_num)
    operator = '*'
    
    # Scale the range of num2 based on the specified scale
    num2 = random.randint(1, max_num // scale)
    
    problem_text = f"{num1} {operator} {num2}"
    answer = num1 * num2
    return problem_text, answer

def generate_problem(max_digits, scale, rational_answer, precision):
    operator = random.choice(["+", "-", "*", "/"])
    if operator == "+" or operator == "-":
        return generate_addition_or_subtraction_problem(max_digits=max_digits)
    elif operator == "/":
        return generate_division_problem(max_digits=max_digits, rational_answer=rational_answer, scale=scale, precision=precision)
    elif operator == "*":
        return generate_multiplication_problem(max_digits=max_digits, scale=scale)

def set_difficulty_settings(difficulty, max_digits=2, scale=2, rational_answer=True, precision=2):
    settings = {}
    
    if difficulty == 'noob':
        settings['max_digits'] = 1
        settings['scale'] = 2
        settings['rational_answer'] = True
        settings['precision'] = 1
    elif difficulty == 'basic':
        settings['max_digits'] = 2
        settings['scale'] = 4
        settings['rational_answer'] = True
        settings['precision'] = 2
    elif difficulty == 'intermediate':
        settings['max_digits'] = 3
        settings['scale'] = 4
        settings['rational_answer'] = True
        settings['precision'] = 2
    elif difficulty == 'advanced':
        settings['max_digits'] = 5
        settings['scale'] = 3
        settings['rational_answer'] = True
        settings['precision'] = 4
    elif difficulty == 'god_tier':
        settings['max_digits'] = 6
        settings['scale'] = 2
        settings['rational_answer'] = True
        settings['precision'] = 6
    elif difficulty == 'custom':
        # Set custom values here
        settings['max_digits'] = max_digits
        settings['scale'] = scale
        settings['rational_answer'] = rational_answer
        settings['precision'] = precision
    else:
        # Default values for an unknown difficulty level
        settings['max_digits'] = 2
        settings['scale'] = 2
        settings['rational_answer'] = True
        settings['precision'] = 2

    return settings
