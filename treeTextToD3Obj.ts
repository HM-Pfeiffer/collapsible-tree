const fs = require('fs');

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

// Function to convert a tree text format to a JSON tree structure.
function convertTreeTextToD3Tree(treeText: string): TreeNode {
  const lines = treeText.split('\n').filter((line) => line.trim() !== '');
  const root: TreeNode = { name: 'root', children: [] };
  const stack: TreeNode[] = [root];

  lines.forEach((line) => {
    const depth = line.lastIndexOf('─') + 2;
    const name = line.substring(depth).trim();
    const node: TreeNode = { name };

    // Ensure we correctly manage the depth to find the parent node
    while (depth < stack.length) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(node);
    stack.push(node); // Continue to track this node if it might have children
  });

  if (!root.children) {
    throw new Error("No children found on root");
  }
  return root.children[0]; // Returning the first child as the actual root
}

function readFileSync(): string  {
  try {
    const treeText = fs.readFileSync('tree.txt', 'utf8')
    return treeText;
  } catch (e) {
    console.error("Failed to read file:", e);
    throw e; // Re-throw the error to indicate file reading failure
  }
}

let d3TreeData;

try {
  d3TreeData = convertTreeTextToD3Tree(readFileSync());
} catch (e) {
  console.error('Error converting tree text to D3 tree:', e);
  process.exit(1); // Exit the process with a non-zero status code
}

const filename = 'output.json'; // Name of the file to write to

// Convert the JavaScript object to a JSON string with indentation for readability
const jsonString = JSON.stringify(d3TreeData, null, 2);
console.log(`Current working directory: ${process.cwd()}`);
// Write the JSON string to a file
try {
  fs.writeFileSync(filename, jsonString, 'utf8');
  console.log('JSON data has been written to', filename);
} catch (err) {
  console.error('An error occurred:', err);
}



