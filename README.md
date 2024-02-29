# US Income Visualisations

This repo creates animated data visualisations of US household and individual income:
![Individual incomes](/animations/gif/individual.gif)

The data comes from [IPUMs](https://cps.ipums.org/cps/about.shtml), which itself comes from the [US Current Population Survey](https://en.wikipedia.org/wiki/Current_Population_Survey).

The data preparation is performed in `data-preparation.ipynb`.

The actual visualisation is done with D3.js and CSS. For a customisable visualisation webpage, run the following terminal commands:

Go to the "webpage" directory
```
cd ./webpage
```
And run a basic Python http server on port 8000
```
python -m http.server 8000
```
Now open `http://localhost:8000/` in a browser and you'll see the visualisations.

To convert this into a gif, take a screen recordings of the four visualisations and save them under `/animation/screen-recordings/individual.mov`, `/animation/screen-recordings/household.mov`, `/animation/screen-recordings/male.mov`, and `/animation/screen-recordings/female.mov` then run `./animations/gif-converter.sh`, which will convert the movs to gifs and place them in `/animation/gif`.
