const natural = require('natural');
const classifier = new natural.BayesClassifier();

// Function to train the classification model
function trainModel() {
  // Load training data from MongoDB or a JSON file
  const trainingData = [
    { text: 'Frequent power outages', department: 'Electricity' },
    // Add more training data for both departments
    // ...

    // Modify training data to include keywords
   
        { text: 'power outages electricity electrical fault billing issues transformer  voltage overcharging wires disruptions renewable', department: 'Electricity' },
        { text: 'health issues flu symptoms disease health problems medical doctor illness healthcare emergency patient sanitation hygiene fever dengue epidemic food safety', department: 'Health' },
        { text: 'water supply water problems pipelines irrigation problems rainwater river well tank dams reservoir aquatic waterbed sewage', department: 'Water Resources' },
        { text: 'road street lights drainage problems public transportation construction potholes sidewalks footpaths renovation bridges overpasses pedestrian crossings parking parks', department: 'Public Works' },
        {text:'street cleaning property taxes building permits sewage garbage disposal bins litter recycling bins',department:'Municipal Corporation'},
        { text: 'school curriculum teacher enrollment classroom textbook sports student scholarship education science computer learning career skill future grading evaluation', department: 'Education' }
    // Add more training data based on keywords
    // ...
  ];

  // Preprocess and train the model
  trainingData.forEach((data) => {
    // Split the text into keywords and use them for training
    const keywords = natural.PorterStemmer.tokenizeAndStem(data.text);
    
      classifier.addDocument(keywords, data.department);
    
  });

  classifier.train();
}

// Function to predict the department of a complaint based on keywords
function predictDepartment(complaintText) {
  // Extract and use keywords from the complaintText
  const keywords = natural.PorterStemmer.tokenizeAndStem(complaintText);

  // Classify the complaintText based on keywords
  const department = classifier.classify(keywords);
  return department;
}

// Export the functions
module.exports = { trainModel, predictDepartment };