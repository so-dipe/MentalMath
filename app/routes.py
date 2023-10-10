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
        precision = int(request.form.get('precision'))
        settings = set_difficulty_settings(difficulty, max_digits=max_digits, scale=scale, rational_answer=rational_answer, precision=precision)
    else:
        settings = set_difficulty_settings(difficulty)

    max_digits = settings['max_digits']
    scale = settings['scale']
    rational_answer = settings['rational_answer']
    precision = settings['precision']

    exercise_problems = [generate_problem(max_digits=max_digits, scale=scale, rational_answer=rational_answer, precision=precision) for _ in range(20)]
    session['exercise_problems'] = exercise_problems
    session['user_answers'] = []

    return jsonify({'exe':session['exercise_problems'], "redirect_url":"/exercise"})

@app.route('/exercise', methods=["GET", "POST"])
def exercise():
    if True:
        return render_template('exercise.html')

@app.route('/save_results', methods=['POST'])
def save_results():
    # Initialize the saved_results list in the session if it doesn't exist
    if 'saved_results' not in session:
        session['saved_results'] = []

    results_data = request.json

    # Get the current saved_results list from the session
    saved_results = session.get('saved_results', [])

    # Append the new results_data to the list
    saved_results.append(results_data)

    # Keep only the last 100 results in the list
    if len(saved_results) > 100:
        saved_results = saved_results[-100:]

    # Update the saved_results list in the session
    session['saved_results'] = saved_results

    return jsonify({'message': 'Results saved successfully'})
    


