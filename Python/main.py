import joblib
import numpy as np
import pandas as pd
import warnings

# Function to apply custom rounding logic
def custom_round(value):
    fractional_part = value - np.floor(value)
    if fractional_part >= 0.5:
        return np.ceil(value)
    else:
        return np.floor(value)

# Load the saved model, encoders, and CSV for statistics
model = joblib.load('xgboost_model.joblib')
label_encoder_team = joblib.load('label_encoder_team.joblib')
label_encoder_player = joblib.load('label_encoder_player.joblib')
stats = pd.read_csv('goalscorers_with_winner.csv')

# Function to predict number of goals for a player based on input parameters
def predict_goals(player_name, player_team, opponent_team, is_winner):
    player_encoded = label_encoder_player.transform([player_name])[0]
    player_team_encoded = label_encoder_team.transform([player_team])[0]
    opponent_team_encoded = label_encoder_team.transform([opponent_team])[0]
    features = [[player_encoded, player_team_encoded, opponent_team_encoded, is_winner]]

    # Predict using the model
    predicted_goals = model.predict(features)

    # Generate textual explanation
    explanation = generate_textual_explanation(player_name, player_team, opponent_team, is_winner, predicted_goals[0])

    return custom_round(predicted_goals[0]), explanation

# Function to generate a human-friendly explanation based on player statistics
def generate_textual_explanation(player_name, player_team, opponent_team, is_winner, predicted_goals):
    predicted_goals = custom_round(predicted_goals)

    # Get player statistics for the specific team
    player_stats = stats[stats['scorer'] == player_name]
    player_team_stats = player_stats[player_stats['team'] == player_team]

    # Calculate statistics
    if player_team_stats.empty:
        return f"{player_name} never played with {player_team} team but acoording to it's history against {opponent_team} it is predicted for him to score {predicted_goals} goals"

    player_matches = player_team_stats[['date', 'home_team', 'away_team']].drop_duplicates()

    player_goals_in_wins = player_team_stats[player_team_stats['is_winner'] == 1].shape[0]
    player_goals_in_losses = player_team_stats[player_team_stats['is_winner'] == 0].shape[0]

    player_matches_in_wins = \
    player_team_stats[player_team_stats['is_winner'] == 1][['date', 'home_team', 'away_team']].drop_duplicates().shape[
        0]
    player_matches_in_losses = \
    player_team_stats[player_team_stats['is_winner'] == 0][['date', 'home_team', 'away_team']].drop_duplicates().shape[
        0]

    if player_matches_in_wins > 0:
        avg_goals_in_wins = player_goals_in_wins / player_matches_in_wins
    else:
        avg_goals_in_wins = 0

    if player_matches_in_losses > 0:
        avg_goals_in_losses = player_goals_in_losses / player_matches_in_losses
    else:
        avg_goals_in_losses = 0

    # Prepare the explanation based on winning status and comparison
    if is_winner:
        player_goals = custom_round(avg_goals_in_wins)

        if player_goals > predicted_goals:
            explanation = (
                f"Based on {player_name}'s recent performances with {player_team}, "
                f"{player_name} has scored {player_goals_in_wins} goals while being on the winning side, "
                f"{player_name} generally scores  {player_goals:.2f} goals in wins. Due to {opponent_team}'s good defense, the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )
        else:
            explanation = (
                f"Based on {player_name}'s recent performances with {player_team}, "
                f"{player_name} has scored {player_goals_in_wins} goals while being on the winning side, "
                f"{player_name} generally scores  {player_goals:.2f} goals in wins. Given {player_name}'s historical data suggesting aggressive gameplay against {opponent_team}, the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )
    else:
        player_goals = custom_round(avg_goals_in_losses)

        if player_goals > predicted_goals:
            explanation = (
                f"Reviewing {player_name}'s recent matches with {player_team}, "
                f"{player_name} has scored {player_goals_in_wins} goals while being on the loosing side, "
                f"{player_name} generally scores  {player_goals:.2f} goals in losses. Due to {opponent_team}'s good defense, the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )
        else:
            explanation = (
                f"Reviewing {player_name}'s recent matches with {player_team}, "
                f"{player_name} has scored {player_goals_in_wins} goals while being on the loosing side, "
                f"{player_name} generally scores  {player_goals:.2f} goals in losses. Given {player_name}'s historical data suggesting aggressive gameplay against {opponent_team}, the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )

    return explanation


# Example usage of prediction function
player_name = 'Ludovic Magnin'
player_team = 'Switzerland'
opponent_team = 'Argentina'
is_winner = 1

predicted_goals, explanation = predict_goals(player_name, player_team, opponent_team, is_winner)
warnings.filterwarnings("ignore")
print(f"Predicted goals: {predicted_goals}")
print(f"Explanation: {explanation}")
