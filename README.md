# US Income Visualisations

This repo creates animated data visualisations of US household and individual income:
![Household incomes](/animations/gif/household.gif)
![Individual incomes](/animations/gif/individual.gif)
![Female incomes](/animations/gif/female.gif)
![Male incomes](/animations/gif/male.gif)

These animations are available in [gif](/animations/gif/), [gif (big)](/animations/big-gif/), [mp4](/animations/mp4/), and [mov](/animations/mov/).

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
