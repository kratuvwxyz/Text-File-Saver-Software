const fs = require("fs");

// Function to read the content of a file
function readFromFile() {
  // Choose the file path
  const filePath = "output.csv";

  try {
    // Read the content of the file
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Display the content in the textarea
    document.getElementById("textInput").value = fileContent;
  } catch (err) {
    // Handle the error, e.g., the file doesn't exist yet
    console.error("Error reading file:", err.message);
  }
}

// Function to save content to a file
function saveToFile() {
  let textInput = document.getElementById("textInput").value;
  let x = [];
  const textDate = document.getElementById("dateD").value;
  x.push(textDate);
  const textAmount = document.getElementById("amount").value;
  x.push(textAmount);
  const textPlace = document.getElementById("place").value;
  x.push(textPlace);
  const textReason = document.getElementById("reason").value;
  x.push(textReason);

  textInput += "\n" + x.toString();

  // Choose the file path
  const filePath = "output.csv";

  try {
    // Write the content to the file
    fs.writeFileSync(filePath, textInput);

    alert("Text saved to file!");
  } catch (err) {
    // Handle the error
    console.error("Error writing to file:", err.message);
  }
}

// Call readFromFile when the page loads
window.onload = readFromFile;
