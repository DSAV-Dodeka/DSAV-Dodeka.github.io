Script for resizing images:

Run this script from the img-optimize main folder.

```shell
#!/bin/bash
# Script by https://christitus.com/script-for-optimizing-images/
# Dependancies
# - img-optimize - https://virtubox.github.io/img-optimize/
# - imagemagick
# - jpegoptim
# - optipng

FOLDER="/home/erag/files/gitp/DSAV-Dodeka.github.io/src/images"

#resize png or jpg to either height or width, keeps proportions using imagemagick
find ${FOLDER} -iname '*.jpg' -o -iname '*.png' -exec convert \{} -verbose -resize 2400x\> \{} \;
find ${FOLDER} -iname '*.jpg' -o -iname '*.png' -exec convert \{} -verbose -resize x1300\> \{} \;
find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize 2400x\> \{} \;
find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize x1300\> \{} \;
./optimize.sh --std --path ${FOLDER}
```