#!/bin/bash

# Define an array of your specific video names
# declare -a videos=("individual" "male" "female" "household")
declare -a videos=("female")

# Loop through the array
for video in "${videos[@]}"; do
  # Define file paths
  input_path="./screen-recordings/${video}.mov"
  palette_path="./palette/${video}.png"
  output_path="./gif/${video}.gif"

  # Ensure output directories exist
  mkdir -p ./palette ./gif

  # Generate palette
  ffmpeg -i "$input_path" -vf "fps=10,scale=600:-1:flags=lanczos,palettegen" "$palette_path"

  # Use palette to create GIF
  # and trim to 25 seconds
  # ffmpeg -i "$input_path" -i "$palette_path" -filter_complex "fps=10,scale=600:-1:flags=lanczos[x];[x][1:v]paletteuse" "$output_path"
  ffmpeg -i "$input_path" -i "$palette_path" -filter_complex "[0:v]trim=duration=25,fps=10,scale=600:-1:flags=lanczos[x];[x][1:v]paletteuse" "$output_path"

done
