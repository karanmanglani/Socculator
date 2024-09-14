import joblib
import numpy as np
import pandas as pd
import warnings
import argparse


# Function to apply custom rounding logic
def custom_round(value):
    fractional_part = value - np.floor(value)
    if fractional_part >= 0.5:
        return np.ceil(value)
    else:
        return np.floor(value)


# Function to predict number of goals for a player based on input parameters
def predict_goals(model, player_name, player_team, opponent_team, is_winner, label_encoder_team, label_encoder_player,
                  stats):
    player_encoded = label_encoder_player.transform([player_name])[0]
    player_team_encoded = label_encoder_team.transform([player_team])[0]
    opponent_team_encoded = label_encoder_team.transform([opponent_team])[0]
    features = [[player_encoded, player_team_encoded, opponent_team_encoded, is_winner]]

    # Predict using the model
    predicted_goals = model.predict(features)

    # Generate textual explanation
    explanation = generate_textual_explanation(player_name, player_team, opponent_team, is_winner, predicted_goals[0],
                                               stats)
    if(predicted_goals < 1.25):
        return 0,explanation

    return custom_round(predicted_goals[0]), explanation


# Function to generate a human-friendly explanation based on player statistics
def generate_textual_explanation(player_name, player_team, opponent_team, is_winner, predicted_goals, stats):
    if(predicted_goals < 1.25):
        predicted_goals = 0
    else:
        predicted_goals = custom_round(predicted_goals)

    # Get player statistics for the specific team
    player_stats = stats[stats['scorer'] == player_name]
    player_team_stats = player_stats[player_stats['team'] == player_team]

    # Calculate statistics
    if player_team_stats.empty:
        return f"{player_name} never played with {player_team} team but according to its history against {opponent_team}, it is predicted for them to score {predicted_goals} goals."

    player_matches = player_team_stats[['date', 'home_team', 'away_team']].drop_duplicates()

    player_goals_in_wins = player_team_stats[player_team_stats['is_winner'] == 1].shape[0]
    player_goals_in_losses = player_team_stats[player_team_stats['is_winner'] == 0].shape[0]

    player_matches_in_wins = \
    player_team_stats[player_team_stats['is_winner'] == 1][['date', 'home_team', 'away_team']].drop_duplicates().shape[
        0]
    player_matches_in_losses = \
    player_team_stats[player_team_stats['is_winner'] == 0][['date', 'home_team', 'away_team']].drop_duplicates().shape[
        0]

    avg_goals_in_wins = player_goals_in_wins / player_matches_in_wins if player_matches_in_wins > 0 else 0
    avg_goals_in_losses = player_goals_in_losses / player_matches_in_losses if player_matches_in_losses > 0 else 0

    # Prepare the explanation based on winning status and comparison
    if is_winner:
        player_goals = custom_round(avg_goals_in_wins)

        if player_goals > predicted_goals:
            explanation = (
                f"Based on {player_name}'s recent performances with {player_team}, "
                f"{player_name} has scored {player_goals_in_wins} goals while being on the winning side, "
                f"and generally scores {player_goals:.2f} goals in wins. Due to {opponent_team}'s strong defense, "
                f"the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )
        else:
            explanation = (
                f"Based on {player_name}'s recent performances with {player_team}, "
                f"{player_name} has scored {player_goals_in_wins} goals while being on the winning side, "
                f"and generally scores {player_goals:.2f} goals in wins. Given {player_name}'s aggressive gameplay "
                f"against {opponent_team}, the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )
    else:
        player_goals = custom_round(avg_goals_in_losses)

        if player_goals > predicted_goals:
            explanation = (
                f"Reviewing {player_name}'s recent matches with {player_team}, "
                f"{player_name} has scored {player_goals_in_losses} goals while on the losing side, "
                f"and generally scores {player_goals:.2f} goals in losses. Due to {opponent_team}'s solid defense, "
                f"the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )
        else:
            explanation = (
                f"Reviewing {player_name}'s recent matches with {player_team}, "
                f"{player_name} has scored {player_goals_in_losses} goals while on the losing side, "
                f"and generally scores {player_goals:.2f} goals in losses. Given {player_name}'s historical data, "
                f"the model predicts {predicted_goals:.2f} goals for {player_name} in this match."
            )

    return explanation


# Main function to handle command-line arguments and perform prediction
if __name__ == "__main__":
    # Argument parser setup
    parser = argparse.ArgumentParser(description="Predict the number of goals scored by a player using a trained model")
    parser.add_argument('model_name', type=str, help='The name of the model to load (without .joblib)')
    parser.add_argument('player_name', type=str, help='The name of the player for prediction')
    parser.add_argument('player_team', type=str, help='The name of the player\'s team')
    parser.add_argument('opponent_team', type=str, help='The name of the opponent team')
    parser.add_argument('is_winner', type=int, help='Whether the player\'s team won (1 for yes, 0 for no)')
    args = parser.parse_args()

    # Load the model and encoders dynamically
    model_file = args.model_name + '.joblib'
    model = joblib.load(model_file)
    label_encoder_team = joblib.load('label_encoder_team.joblib')
    label_encoder_player = joblib.load('label_encoder_player.joblib')
    stats = pd.read_csv('goalscorers_with_winner.csv')

    # Perform prediction
    predicted_goals, explanation = predict_goals(model, args.player_name, args.player_team, args.opponent_team,
                                                 args.is_winner, label_encoder_team, label_encoder_player, stats)

    # Ignore warnings
    warnings.filterwarnings("ignore")

    # Print the results
    print(f"Predicted goals: {predicted_goals}")
    print(f"Explanation: {explanation}")
