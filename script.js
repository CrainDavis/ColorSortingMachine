$("#submitBtn").on("click", function () {
  event.preventDefault();
  $("#colorSquare").css("background-color", "");

  var validateRed = $("#redColor").val();
  var validateGreen = $("#greenColor").val();
  var validateBlue = $("#blueColor").val();

  if (
    parseInt(validateRed) >= 0 &&
    parseInt(validateRed) <= 255 &&
    parseInt(validateGreen) >= 0 &&
    parseInt(validateGreen) <= 255 &&
    parseInt(validateBlue) >= 0 &&
    parseInt(validateBlue) <= 255
  ) {
    // get the user's three input values...
    var userRedValue = $("#redColor").val();
    var userGreenValue = $("#greenColor").val();
    var userBlueValue = $("#blueColor").val();
    // and store them in an array
    var rgbValues = [userRedValue, userGreenValue, userBlueValue];

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
    console.log("number array", numArray);
    // same thing, but sorted from largest to smallest (this was for testing purposes and ended up not being used anywhere...)
    var sortedNumArray = [redNum, greenNum, blueNum].sort((a, b) => b - a);
    console.log("sorted number array", sortedNumArray);

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
        [125, 255, 0], // yellow-green *
        [0, 255, 0], // green
        [0, 255, 125], // turquoise *
        [0, 255, 255], // cyan *
        [0, 125, 255], // aqua *
        [0, 0, 255], // blue
        [125, 0, 255], // purple *
        [255, 0, 255], // magenta
        [255, 0, 125], // pink *
      ];

      // for each "true color", get the difference from the user's input
      // Red, Orange, Yellow, Lime, Green, Turquoise, Cyan, Aqua, Blue, Purple, Magenta, Pink
      for (var i = 0; i < trueROYLGTCABVMP.length; i++) {
        var currentTrueColor = trueROYLGTCABVMP[i];
        getDifferences(currentTrueColor, numArray);
        // for testing purposes...
        if (i === trueROYLGTCABVMP.length - 1) {
          console.log("color differences array", colorDifferences);
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
      // matches are always consecutive odd numbers, plus [1] & [11]...
      // this latter case will be worked out separately from the for loop below
      const oddNumbers = [1, 3, 5, 7, 9, 11];
      // default
      var hasMatch = false;
      // go through the colorDifferences array and see if there are any matching values
      for (var o = 0; o <= oddNumbers.length - 1; o++) {
        // determine first and second indexes:
        var firstIndex = oddNumbers[o];
        var secondIndex;
        if (firstIndex === oddNumbers[5]) {
          secondIndex = oddNumbers[0];
        } else {
          secondIndex = oddNumbers[o + 1];
        }

        if (
          // checking for matches...
          colorDifferences[firstIndex] === colorDifferences[secondIndex] &&
          (colorDifferences.indexOf(lowestSum) === firstIndex ||
            colorDifferences.indexOf(lowestSum) === secondIndex)
        ) {
          // for testing purposes:
          console.log("has match at:", firstIndex, secondIndex);
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
          console.log("two values are equal; one is less");
          // if red and green are the same, the color is yellow
          if (redNum === greenNum) {
            console.log("1) red = green > blue; category yellow");
            colorCategory = "yellow";
            // if green and blue are the same, the color is green
          } else if (greenNum === blueNum) {
            console.log("2) green = blue > red; category green");
            colorCategory = "green";
            // if red and blue are the same, the color is red
          } else if (redNum === blueNum) {
            console.log("3) red = blue > green; category red");
            colorCategory = "red";
          }
          // if two values are equal and the third is greater:
        } else if (
          (redNum === greenNum && redNum < blueNum) ||
          (greenNum === blueNum && greenNum < redNum) ||
          (redNum === blueNum && redNum < greenNum)
        ) {
          console.log("two values are equal; one is greater");
          // if red and green are the same, the color is blue
          if (redNum === greenNum) {
            console.log("4) red = green < blue; category blue");
            colorCategory = "blue";
            // if green and blue are the same, the color is red
          } else if (greenNum === blueNum) {
            console.log("5) green = blue < red; category red");
            colorCategory = "red";
            // if red and blue are the same, the color is green
          } else if (redNum === blueNum) {
            console.log("6) red = blue < green; category green");
            colorCategory = "green";
          }
          // otherwise, if the three user input values are all different:
        } else if (
          redNum !== greenNum &&
          greenNum !== blueNum &&
          redNum !== blueNum
        ) {
          console.log("all values are different");
          // if red is the highest value:
          if (redNum > greenNum && redNum > blueNum) {
            // if green is the second-highest
            if (greenNum > blueNum) {
              console.log("7) order RGB; category orange");
              colorCategory = "orange";
              // or if blue is the second-highest
            } else if (blueNum > greenNum) {
              console.log("8) order RBG; category red");
              colorCategory = "red";
            }
            // if green is the highest value:
          } else if (greenNum > redNum && greenNum > blueNum) {
            // if red is the second-highest
            if (redNum > blueNum) {
              console.log("9) order GRB; category green");
              colorCategory = "green";
              // or if blue is the second-highest
            } else if (blueNum > redNum) {
              console.log("10) order GBR; category green");
              colorCategory = "green";
            }
            // if blue is the highest value:
          } else if (blueNum > redNum && blueNum > greenNum) {
            // if green is the second-highest
            if (greenNum > redNum) {
              console.log("11) order BGR; category blue");
              colorCategory = "blue";
              // or if red is the second highest
            } else if (redNum > greenNum) {
              console.log("12) order BRG; category blue");
              colorCategory = "purple";
            }
          }
        }
        // handles case that there are no matching values in colorDifferences array:
      } else {
        console.log("no matching values; compare to lowest sum");
        // check to see which index holds the lowest value,
        // and use that to determine the color category
        if (colorDifferences.indexOf(lowestSum) === 0) {
          console.log("13) category red");
          colorCategory = "red";
        } else if (colorDifferences.indexOf(lowestSum) === 1) {
          console.log("14) category orange");
          colorCategory = "orange";
        } else if (colorDifferences.indexOf(lowestSum) === 2) {
          console.log("15) category yellow");
          colorCategory = "yellow";
        } else if (colorDifferences.indexOf(lowestSum) === 3) {
          console.log("16) category (yellow-)green");
          colorCategory = "yellowgreen";
        } else if (colorDifferences.indexOf(lowestSum) === 4) {
          console.log("17) category green");
          colorCategory = "green";
        } else if (colorDifferences.indexOf(lowestSum) === 5) {
          console.log("18) category (turquoise) green");
          colorCategory = "turquoise";
        } else if (colorDifferences.indexOf(lowestSum) === 6) {
          console.log("19) category cyan");
          colorCategory = "cyan";
        } else if (colorDifferences.indexOf(lowestSum) === 7) {
          console.log("20) category (aqua) blue");
          colorCategory = "aqua";
        } else if (colorDifferences.indexOf(lowestSum) === 8) {
          console.log("21) category blue");
          colorCategory = "blue";
        } else if (colorDifferences.indexOf(lowestSum) === 9) {
          console.log("22) category purple");
          colorCategory = "purple";
        } else if (colorDifferences.indexOf(lowestSum) === 10) {
          console.log("23) category magenta");
          colorCategory = "magenta";
        } else if (colorDifferences.indexOf(lowestSum) === 11) {
          console.log("24) category red (pinkish?)");
          colorCategory = "red";
        }
      }
    }

    // =================================

    var redGreenDiff = Math.abs(redNum - greenNum);
    var greenBlueDiff = Math.abs(greenNum - blueNum);
    var redBlueDiff = Math.abs(redNum - blueNum);
    var averageDiff = (redGreenDiff + greenBlueDiff + redBlueDiff) / 3;

    // if the RGB values are all the same, set the color category to gray, black, or white
    if (redNum === greenNum && greenNum === blueNum) {
      console.log("all values are equal to each other");
      // if the values are each between 30 and 240, set to gray
      if (redNum >= 30 && redNum <= 240) {
        console.log("25) category gray");
        colorCategory = "gray";
        // if the values are each less than 30, set to black
      } else if (redNum < 30 && redNum >= 0) {
        console.log("26) category black");
        colorCategory = "black";
        // if the values are each more than 240, set to white
      } else if (redNum > 240 && redNum <= 255) {
        console.log("27) category white");
        colorCategory = "white";
      }
    } else {
      console.log("average difference", averageDiff);
      // get a gray category even if the values are not all the same
      if (averageDiff < 10) {
        // if the average distance between the three values is then than 10,
        console.log("28) category gray");
        // then categorize color as grey
        colorCategory = "gray";
      } else {
        // if the average is less than 30, then the color is close to black
        if (averageColor >= 0 && averageColor <= 30) {
          console.log("29) based on average: category black");
          colorCategory = "black";
          // if the average is between 30 and 240, then run the above compareColors function
        } else if (averageColor > 30 && averageColor < 240) {
          compareColors(numArray);
          // if the average is greater than 240, then the color is close to white
        } else if (averageColor >= 240 && averageColor <= 255) {
          console.log("30) based on average: category white");
          colorCategory = "white";
        }
      }
    }

    $("#colorCategory").text(colorCategory).css("color", `${colorCategory}`);
  } else {
    alert("Input numbers between 0 and 255; NO LETTERS OR SYMBOLS ALLOWED!");
  }
});
