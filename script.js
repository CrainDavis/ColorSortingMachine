$("#submitBtn").on("click", function () {
  event.preventDefault();
  $("#colorSquare").css("background-color", "");

  // get the user's three input values...
  var userRedValue = $("#redColor").val();
  var userGreenValue = $("#greenColor").val();
  var userBlueValue = $("#blueColor").val();
  // and store them in an array
  rgbValues = [userRedValue, userGreenValue, userBlueValue];

  // create a string to display on the browser page
  var colorString = "";
  for (var i = 0; i < 3; i++) {
    var currentVal = rgbValues[i];
    colorString += currentVal.toString();
    if (i < 2) {
      colorString += ", ";
    }
  }
  $("#valRed").text(userRedValue);
  $("#valGreen").text(userGreenValue);
  $("#valBlue").text(userBlueValue);
  $("#colorSquare").css("background-color", `rgb(${colorString})`);

  // =========================================================================

  // text that will later be displayed on page ("color category")
  var colorCategory = "";

  // get the user's values and convert from strings to numbers
  var redNum = parseInt(userRedValue);
  var greenNum = parseInt(userGreenValue);
  var blueNum = parseInt(userBlueValue);

  // get the average of the three values
  var averageColor = (redNum + greenNum + blueNum) / 3;
  // store the three values in an array
  var numArray = [redNum, greenNum, blueNum];
  // same thing, but sorted from largest to smallest (this was for testing purposes...)
  var sortedNumArray = [redNum, greenNum, blueNum].sort((a, b) => b - a);

  // =================================

  // an array storing the added differences between the user values and the "true color values"
  var colorDifferences = [];

  // function to get these differences and push them into above array
  function getDifferences(trueColor, numArray) {
    var diffRed = Math.abs(trueColor[0] - numArray[0]);
    var diffGreen = Math.abs(trueColor[1] - numArray[1]);
    var diffBlue = Math.abs(trueColor[2] - numArray[2]);

    var differenceSum = diffRed + diffGreen + diffBlue;
    colorDifferences.push(differenceSum);
  }

  // function to compare true colors to user's input colors
  function compareColors(numArray) {
    // "true colors" 2D array:
    const trueROYLGTCABVMP = [
      [255, 0, 0], // red
      [255, 125, 0], // orange
      [255, 255, 0], // yellow
      [125, 255, 0], // yellow-green
      [0, 255, 0], // green
      [0, 255, 125], // turquoise
      [0, 255, 255], // cyan
      [0, 125, 255], // aqua
      [0, 0, 255], // blue
      [125, 0, 255], // violet
      [255, 0, 255], // magenta
      [255, 0, 125], // pink
    ];

    // for each "true color", get the difference from the user's input
    for (var i = 0; i < trueROYLGTCABVMP.length; i++) {
      var currentTrueColor = trueROYLGTCABVMP[i];
      getDifferences(currentTrueColor, numArray);
      // for testing purposes...
      if (i === trueROYLGTCABVMP.length - 1) {
        // console.log("color differences array", colorDifferences);
      }
    }

    // get the lowest difference from the above
    var lowestSum = colorDifferences[0];
    for (var k = 1; k < colorDifferences.length; k++) {
      currentSum = colorDifferences[k];

      if (currentSum < lowestSum) {
        lowestSum = currentSum;
      }
    }

    // =================================

    // sometimes the colorDifferences array will contain two equal values; PS sorting is not an option
    // matches are always consecutive odd numbers, plus [1] and [11]... 
    // this latter case will be worked out separately from the for loop below
    const oddNumbers = [1, 3, 5, 7, 9, 11];
    // default
    var hasMatch = false;
    // go through the colorDifferences array and see if there are any matching values
    for (var o = 0; o < oddNumbers.length - 1; o++) {
      var firstIndex = oddNumbers[o];
      var secondIndex = oddNumbers[o + 1];
      if (
        colorDifferences[firstIndex] === colorDifferences[secondIndex] &&
        (colorDifferences.indexOf(lowestSum) === firstIndex ||
          colorDifferences.indexOf(lowestSum) === secondIndex)
      ) {
        // for testing purposes:
        // console.log("has match at:", firstIndex, secondIndex);
        // set this to "true" for later
        hasMatch = true;
      }
    }

    // if there are matching values:
    if (hasMatch === true) {
        // if two values are equal and the third is less:
      if (
        (redNum === greenNum && redNum > blueNum) ||
        (greenNum === blueNum && greenNum > redNum) ||
        (redNum === blueNum && redNum > greenNum)
      ) {
          // if red and green are the same, the color is yellow
        if (redNum === greenNum) {
          colorCategory = "yellow";
          // if green and blue are the same, the color is green
        } else if (greenNum === blueNum) {
          colorCategory = "green";
          // if red and blue are the same, the color is red
        } else if (redNum === blueNum) {
          colorCategory = "red";
        }
        // if two values are equal and the third is more:
      } else if (
        (redNum === greenNum && redNum < blueNum) ||
        (greenNum === blueNum && greenNum < redNum) ||
        (redNum === blueNum && redNum < greenNum)
      ) {
          // if red and green are the same, the color is blue
        if (redNum === greenNum) {
          colorCategory = "blue";
          // if green and blue are the same, the color is red
        } else if (greenNum === blueNum) {
          colorCategory = "red";
          // if red and blue are the same, the color is green
        } else if (redNum === blueNum) {
          colorCategory = "green";
        }
        // otherwise, if the three user input values are all different:
      } else if (
        redNum !== greenNum &&
        greenNum !== blueNum &&
        redNum !== blueNum
      ) {
          // if red is the highest value:
        if (redNum > greenNum && redNum > blueNum) {
            // if green is the second-highest
          if (greenNum > blueNum) {
            colorCategory = "orange";
            // or if blue is the second-highest
          } else if (blueNum >= greenNum) {
            colorCategory = "red";
          }
          // if green is the highest value:
        } else if (greenNum > redNum && greenNum > blueNum) {
            // if red is the second-highest
          if (redNum > blueNum) {
            colorCategory = "green";
            // or if blue is the second-highest
          } else if (blueNum >= redNum) {
            colorCategory = "green";
          }
          // if blue is the highest value:
        } else if (blueNum > redNum && blueNum > greenNum) {
            // if green is the second-highest
          if (greenNum > redNum) {
            colorCategory = "blue";
            // or if red is the second highest
          } else if (redNum >= greenNum) {
            colorCategory = "blue";
          }
        }
      }
      // handles the case that the colorDifference values at index 1 is the same as index 11
    } else if (colorDifferences[1] === colorDifferences[11]) {
        // if two values are equal and the third is less:
      if (
        (redNum === greenNum && redNum > blueNum) ||
        (greenNum === blueNum && greenNum > redNum) ||
        (redNum === blueNum && redNum > greenNum)
      ) {
        // if red and green are the same, the color is yellow
        if (redNum === greenNum) {
          colorCategory = "yellow";
        // if green and blue are the same, the color is green
        } else if (greenNum === blueNum) {
          colorCategory = "green";
        // if red and blue are the same, the color is red
        } else if (redNum === blueNum) {
          colorCategory = "red";
        }
        // if two values are equal and the third is more:
      } else if (
        (redNum === greenNum && redNum < blueNum) ||
        (greenNum === blueNum && greenNum < redNum) ||
        (redNum === blueNum && redNum < greenNum)
      ) {
        // if red and green are the same, the color is blue
        if (redNum === greenNum) {
          colorCategory = "blue";
        // if green and blue are the same, the color is red
        } else if (greenNum === blueNum) {
          colorCategory = "red";
        // if red and blue are the same, the color is green
        } else if (redNum === blueNum) {
          colorCategory = "green";
        }
        // otherwise, if the three user input values are all different:
      } else if (
        redNum !== greenNum &&
        greenNum !== blueNum &&
        redNum !== blueNum
      ) {
        // if red is the highest value:
        if (redNum > greenNum && redNum > blueNum) {
            // if green is the second-highest
          if (greenNum > blueNum) {
            colorCategory = "orange";
            // or if blue is the second-highest
          } else if (blueNum >= greenNum) {
            colorCategory = "red";
          }
        // if green is the highest value:
        } else if (greenNum > redNum && greenNum > blueNum) {
            // if red is the second-highest
          if (redNum > blueNum) {
            colorCategory = "green";
            // or if blue is the second-highest
          } else if (blueNum >= redNum) {
            colorCategory = "green";
          }
          // if blue is the highest value:
        } else if (blueNum > redNum && blueNum > greenNum) {
            // if green is the second-highest
          if (greenNum > redNum) {
            colorCategory = "blue";
            // or if red is the second highest
          } else if (redNum >= greenNum) {
            colorCategory = "blue";
          }
        }
      }
      // if the colorDifferences array does not contain any matching values:
    } else {
        // check to see which index holds the lowest value,
        // and use that to determine the color category
      if (colorDifferences.indexOf(lowestSum) === 0) {
        colorCategory = "red";
      } else if (colorDifferences.indexOf(lowestSum) === 1) {
        colorCategory = "orange";
      } else if (colorDifferences.indexOf(lowestSum) === 2) {
        colorCategory = "yellow";
      } else if (colorDifferences.indexOf(lowestSum) === 3) {
        colorCategory = "green";
      } else if (colorDifferences.indexOf(lowestSum) === 4) {
        colorCategory = "green";
      } else if (colorDifferences.indexOf(lowestSum) === 5) {
        colorCategory = "green";
      } else if (colorDifferences.indexOf(lowestSum) === 6) {
        colorCategory = "cyan";
      } else if (colorDifferences.indexOf(lowestSum) === 7) {
        colorCategory = "blue";
      } else if (colorDifferences.indexOf(lowestSum) === 8) {
        colorCategory = "blue";
      } else if (colorDifferences.indexOf(lowestSum) === 9) {
        colorCategory = "purple";
      } else if (colorDifferences.indexOf(lowestSum) === 10) {
        colorCategory = "magenta";
      } else if (colorDifferences.indexOf(lowestSum) === 11) {
        colorCategory = "red";
      } else if (colorDifferences.indexOf(lowestSum) === 12) {
        colorCategory = "black";
      } else if (colorDifferences.indexOf(lowestSum) === 13) {
        colorCategory = "white";
      }
    }
  }

  // =================================

  // if the RGB values are all the same, set the color category to gray, black, or white
  if (redNum === greenNum && greenNum === blueNum) {
      // if the values are each between 30 and 240, set to gray
    if (redNum >= 30 && redNum <= 240) {
      colorCategory = "gray";
      // if the values are each less than 30, set to black
    } else if (redNum < 30 && redNum >= 0) {
      colorCategory = "black";
      // if the values are each more than 240, set to white
    } else if (redNum > 240 && redNum <= 255) {
      colorCategory = "white";
    }
    // otherwise, check to see what the RGB average is...
  } else {
      // if the average is less than 30, then the color is close to black
    if (averageColor >= 0 && averageColor < 30) {
      colorCategory = "black";
      // if the average is between 30 and 240, then run the above compareColors function
    } else if (averageColor >= 30 && averageColor < 240) {
      compareColors(numArray);
      // if the average is greater than 240, then the color is close to white
    } else if (averageColor >= 240 && averageColor <= 255) {
      colorCategory = "white";
    }
  }

  $("#colorCategory").text(colorCategory).css("color", `${colorCategory}`);
});
