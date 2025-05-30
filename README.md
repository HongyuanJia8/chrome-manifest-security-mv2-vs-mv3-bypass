## USE "./run-tests.sh" to run the test

## Install environment
# Install Homebrew and Node.js if you don't have
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node 
node -v 

# Create conda environment if you want
conda create -n mv3study python=3.12 -c conda-forge
conda activate mv3study

# Install package
conda install -y pandas matplotlib jupyterlab ipykernel -c conda-forge

pip install csvkit mitmproxy

python -m ipykernel install --user --name mv3study --display-name "mv3study"

# Install Node / Puppeteer Dependency
conda install -y nodejs=20 -c conda-forge
npm -v 

# initialize Node Dependency
mkdir ~/mv3-study && cd ~/mv3-study
npm init -y
npm install puppeteer csv-writer

# Install CLI Tools (optional)
brew install git jq tcpdump

# Check if everything OK
conda activate mv3study
python - <<'PY'
import pandas, matplotlib
print("✅ pandas", pandas.__version__)
PY

node -e "console.log('✅ Node', process.version)"
npx puppeteer --help | head -n 3

## Download Chrome older version
Go to https://vikyd.github.io/download-chromium-history-version/#/ and select your operating system

Download :
version: 109.0.5413.2
position (revision): 1069704

I downloaded mac-intel version

1. Unzip chrome-mac.zip
2. right click Chromium.app and click "Show Package Contents"
3. Go to MacOS and double click "Chromium" to start the browser




