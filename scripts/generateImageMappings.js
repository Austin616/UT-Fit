import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const exercisesDir = join(__dirname, '../assets/exercises');
const outputFile = join(__dirname, '../constants/exerciseImages.ts');

// Get all exercise directories
const exerciseDirs = readdirSync(exercisesDir).filter(dir => 
  statSync(join(exercisesDir, dir)).isDirectory()
);

// Generate the mappings
const mappings = [];
exerciseDirs.forEach(dir => {
  // Check for 0.jpg
  if (existsSync(join(exercisesDir, dir, '0.jpg'))) {
    mappings.push(`  '${dir}_0': require('../assets/exercises/${dir}/0.jpg')`);
  }
  // Check for 1.jpg
  if (existsSync(join(exercisesDir, dir, '1.jpg'))) {
    mappings.push(`  '${dir}_1': require('../assets/exercises/${dir}/1.jpg')`);
  }
});

// Generate the TypeScript file
const fileContent = `// This file is auto-generated. Do not edit manually.

// Static mapping of exercise images
const exerciseImages: { [key: string]: any } = {
${mappings.join(',\n')}
};

export const loadExerciseImage = (exerciseId: string, index: number): any => {
  const key = \`\${exerciseId}_\${index}\`;
  
  if (key in exerciseImages) {
    return exerciseImages[key];
  }

  console.warn(\`Image not found for exercise \${exerciseId} index \${index}\`);
  return null;
};
`;

writeFileSync(outputFile, fileContent);
console.log('Generated exercise image mappings successfully!'); 