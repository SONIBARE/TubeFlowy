#!/bin/sh

echo "Removing all files from ../slapstuk-tubeflowy/dist"
rm -r ../slapstuk-tubeflowy/dist
echo "Copying files to ../slapstuk-tubeflowy folder..."
cp -r ./dist  ../slapstuk-tubeflowy
echo "Running 'firebase deploy --only hosting' from ../slapstuk-tubeflowy folder..."
initialpath="$cd"
cd ../slapstuk-tubeflowy
firebase deploy --only hosting
cd "$initialpath"
echo "Deploy to Slapstuk hosting done."