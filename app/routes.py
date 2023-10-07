from flask import render_template, request, jsonify, redirect, url_for, session
import json
from app import app  
from app.problem import generate_problem, set_difficulty_settings

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/start', methods=["POST"])
def start_exercise():
    difficulty = request.form.get('difficulty')
    if difficulty == "custom":
        max_digits = int(request.form.get('max_digits'))
        scale = int(request.form.get('scale'))
        rational_answer = request.form.get('rational_answer')
        rational_answer = rational_answer == "true"
        settings = set_difficulty_settings(difficulty, max_digits=max_digits, scale=scale, rational_answer=rational_answer)
    else:
        settings = set_difficulty_settings(difficulty)

    max_digits = settings['max_digits']
    scale = settings['scale']
    rational_answer = settings['rational_answer']

    exercise_problems = [generate_problem(max_digits=max_digits, scale=scale, rational_answer=rational_answer) for _ in range(4)]
    session['exercise_problems'] = exercise_problems
    session['user_answers'] = []

    return jsonify({'exe':session['exercise_problems'], "redirect_url":"/exercise"})
    



@app.route('/exercise', methods=["GET"])
def exercise():
    exercises = session.get("exercise_problems")
    user_answers = session.get('user_answers')

    if request.method == 'POST':
        try:
            user_answer = float(request.form['user_answer'])
            user_answers.append(user_answer)
            print(user_answers)
            session['user_answers'] = user_answers
        except ValueError:
            return jsonify({'error': 'Invalid input. Please enter a number.'})

    if len(user_answers) <= len(exercises):
        return render_template('exercise.html')
    else:
        return redirect(url_for('evaluate'))

from flask import request, jsonify

# @app.route('/evaluate', methods=["POST", "GET"])
# def evaluate():
#     # Receive the user's answers as JSON data from the client side
#     if request.method == "POST":
#         # Handle POST request as you have done
#         try:
#             user_answers = request.get_json(force=True)
#         except ValueError:
#             return jsonify({'error': 'Invalid JSON data'}), 400
#     elif request.method == "GET":
#         # Handle GET request here
#         return "This is a GET request to /evaluate."
    
#     # user_answers = data['user_answers']
#     print(user_answers)

#     # Fetch the exercise problems (you can customize this based on your needs)
#     exercise_problems = session.get('exercise_problems')

#     if not exercise_problems:
#         return jsonify({'error': 'No active exercise. Start the exercise first.'}), 400

#     results = []
#     for i, (problem, correct_answer) in enumerate(exercise_problems):
#         user_answer = user_answers[i] if i < len(user_answers) else None
#         is_correct = user_answer == correct_answer
#         results.append({
#             'problem_text': problem,
#             'correct_answer': correct_answer,
#             'user_answer': user_answer,
#             'is_correct': is_correct
#         })

#     return jsonify({"results": results})
