#!/bin/bash
for f in *.js; do mv -- "$f" "${f%.js}.jsx"; done