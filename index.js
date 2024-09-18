const fs = require('fs');
const path = require('path');

// Function to decode y values from various bases to decimal
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Lagrange interpolation to find f(0)
function lagrangeInterpolation(points) {
    const n = points.length;
    let polynomial = 0;

    for (let i = 0; i < n; i++) {
        const [xi, yi] = points[i];
        let term = yi;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const [xj, _] = points[j];
                term *= (0 - xj) / (xi - xj);  // Substitute x = 0 to find the constant term
            }
        }

        polynomial += term;
    }

    return polynomial;
}

// Path to the JSON file in the testcases folder
const filePath = path.join(__dirname, 'testcases', 'testcase1.json');

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    const data = JSON.parse(jsonData);
    const n = data.keys.n;
    const k = data.keys.k;

    // Extract points (x, y) by decoding the y values
    let points = [];
    for (const key in data) {
        if (!isNaN(parseInt(key))) {
            const x = parseInt(key);
            const base = parseInt(data[key]["base"]);
            const yEncoded = data[key]["value"];
            const y = decodeValue(base, yEncoded);
            points.push([x, y]);
        }
    }

    // Since k points are needed, we only take the first k points
    points = points.slice(0, k);

    // Compute the constant term c using Lagrange interpolation
    const constantTerm = lagrangeInterpolation(points);

    // Output the constant term
    console.log(`The constant term (c) is: ${constantTerm}`);
});
