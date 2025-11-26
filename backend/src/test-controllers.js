// Test script to check all controller exports
const controllers = [
  { name: 'auth', file: './controllers/authController' },
  { name: 'story', file: './controllers/storyController' },
  { name: 'page', file: './controllers/pageController' },
  { name: 'choice', file: './controllers/choiceController' },
  { name: 'game', file: './controllers/gameController' },
  { name: 'admin', file: './controllers/adminController' },
  { name: 'rating', file: './controllers/ratingController' },
  { name: 'ending', file: './controllers/endingController' },
  { name: 'author', file: './controllers/authorController' },
  { name: 'dice', file: './controllers/diceController' },
  { name: 'interactive', file: './controllers/interactiveController' },
  { name: 'journey', file: './controllers/journeyController' },
  { name: 'statistics', file: './controllers/statisticsController' },
  { name: 'report', file: './controllers/reportController' },
  { name: 'tree', file: './controllers/treeController' },
  { name: 'image', file: './controllers/imageController' }
];

console.log('Testing controller imports...\n');

let hasErrors = false;

controllers.forEach(({ name, file }) => {
  try {
    const controller = require(file);
    const exports = Object.keys(controller);
    console.log(`✓ ${name}: ${exports.length} exports - ${exports.join(', ')}`);
  } catch (error) {
    console.error(`✗ ${name}: ERROR - ${error.message}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log('\n❌ Some controllers have errors');
  process.exit(1);
} else {
  console.log('\n✅ All controllers loaded successfully!');
}
