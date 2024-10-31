// Event listener for the summarize button
document.getElementById("summarize-button").addEventListener("click", () => {
    const text = document.getElementById("text-input").value; // Get input text
    if (!text) {
        alert("Please enter some text to summarize."); // Alert if no text is entered
        return; // Exit the function if no text
    }

    const summary = summarizeText(text); // Generate summary
    document.getElementById("summary-output").textContent = summary; // Display summary

    const wordFrequencies = getWordFrequencies(text); // Get word frequencies
    displayFrequencyChart(wordFrequencies); // Display chart with word frequencies
});

// Function to summarize text using a simple frequency-based approach
function summarizeText(text) {
    const sentences = text.split(/[.!?]/).filter(Boolean); // Split text into sentences
    const wordFrequencies = getWordFrequencies(text); // Get word frequencies

    // Sort sentences by their score based on word frequencies
    const rankedSentences = sentences.sort((a, b) => {
        const aScore = sentenceScore(a, wordFrequencies); // Score for sentence a
        const bScore = sentenceScore(b, wordFrequencies); // Score for sentence b
        return bScore - aScore; // Sort in descending order
    });

    // Return the top 2 sentences as the summary
    return rankedSentences.slice(0, 2).join('. ') + ".";
}

// Helper function to calculate the score of a sentence based on word frequency
function sentenceScore(sentence, wordFrequencies) {
    const words = sentence.toLowerCase().split(/\s+/); // Split sentence into words
    return words.reduce((score, word) => score + (wordFrequencies[word] || 0), 0); // Sum scores
}

// Function to get word frequencies in the provided text
function getWordFrequencies(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g); // Extract words
    const frequencies = {}; // Object to hold frequencies

    // Count the occurrences of each word
    words.forEach(word => {
        frequencies[word] = (frequencies[word] || 0) + 1; // Increment count
    });

    return frequencies; // Return word frequencies
}

// Function to display the frequency chart using Chart.js
function displayFrequencyChart(wordFrequencies) {
    const sortedWords = Object.keys(wordFrequencies).sort((a, b) => wordFrequencies[b] - wordFrequencies[a]); // Sort words by frequency
    const topWords = sortedWords.slice(0, 5); // Get top 5 words
    const topFrequencies = topWords.map(word => wordFrequencies[word]); // Get corresponding frequencies

    const ctx = document.getElementById("frequency-chart").getContext("2d"); // Get canvas context

    // Destroy any previous chart instance to avoid overlap
    if (window.frequencyChart) {
        window.frequencyChart.destroy(); // Destroy previous chart
    }

    // Create a new bar chart with updated data
    window.frequencyChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: topWords, // X-axis labels (top words)
            datasets: [{
                label: "Word Frequency", // Dataset label
                data: topFrequencies, // Data for the chart
                backgroundColor: [ // Colors for the bars
                    "#363636", // First color
                    "#dc2f2f", // Second color
                    "#ff894c", // Third color
                    "#ff6b6b", // Lighter shade for variation
                    "#f8f8f8"  // Lightest shade for contrast
                ],
                borderColor: "#363636", // Border color for bars
                borderWidth: 1 // Border width
            }]
        },
        options: {
            responsive: true, // Make the chart responsive
            scales: {
                y: {
                    beginAtZero: true, // Start y-axis at zero
                    ticks: {
                        color: "#363636" // Color for y-axis labels
                    }
                },
                x: {
                    ticks: {
                        color: "#363636" // Color for x-axis labels
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#363636" // Color for legend text
                    }
                }
            }
        }
    });
}
