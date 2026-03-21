const { spawn } = require("child_process");
const path = require("path");

function runModel(features) {
  return new Promise((resolve, reject) => {

    // Use absolute path to avoid working-directory bugs
    const scriptPath = path.join(__dirname, "../../model/predict.py");

    const python = spawn("py", [scriptPath, JSON.stringify(features)]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => { stdout += data.toString(); });
    python.stderr.on("data", (data) => { stderr += data.toString(); });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error("Python error:", stderr);
        return reject(new Error(stderr || "Python process exited with code " + code));
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch {
        // Fallback: if predict.py output isn't JSON for some reason
        reject(new Error("Invalid JSON from predict.py: " + stdout));
      }
    });

  });
}

module.exports = runModel;