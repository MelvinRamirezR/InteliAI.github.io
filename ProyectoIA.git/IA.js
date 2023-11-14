// Definición de la Red Neuronal
class RedNeuronal {
    constructor(inputNodes, hiddenNodes, outputNodes, learningRate) {
      this.inputNodes = inputNodes;
      this.hiddenNodes = hiddenNodes;
      this.outputNodes = outputNodes;
  
      // Inicialización de los pesos
      this.weightsInputHidden = new Matrix(this.hiddenNodes, this.inputNodes);
      this.weightsHiddenOutput = new Matrix(this.outputNodes, this.hiddenNodes);
      this.weightsInputHidden.randomize();
      this.weightsHiddenOutput.randomize();
  
      // Inicialización de la tasa de aprendizaje
      this.learningRate = learningRate;
    }
  
    // Función de activación (en este caso, una función sigmoide)
    sigmoid(x) {
      return 1 / (1 + Math.exp(-x));
    }
  
    // Derivada de la función sigmoide
    sigmoidDerivada(x) {
      return x * (1 - x);
    }
  
    // Entrenamiento de la red neuronal
    train(inputArray, targetArray) {
      // Convierte las entradas y objetivos en matrices
      let inputs = Matrix.fromArray(inputArray);
      let targets = Matrix.fromArray(targetArray);
  
      // --- Forward Propagation ---
      let hidden = Matrix.multiply(this.weightsInputHidden, inputs);
      hidden.map(this.sigmoid);
  
      let outputs = Matrix.multiply(this.weightsHiddenOutput, hidden);
      outputs.map(this.sigmoid);
  
      // --- Backpropagation ---
      let outputErrors = Matrix.subtract(targets, outputs);
  
      let gradients = Matrix.map(outputs, this.sigmoidDerivada);
      gradients.multiply(outputErrors);
      gradients.multiply(this.learningRate);
  
      let hiddenT = Matrix.transpose(hidden);
      let weightsHiddenOutputDeltas = Matrix.multiply(gradients, hiddenT);
  
      this.weightsHiddenOutput.add(weightsHiddenOutputDeltas);
  
      // Calcular los errores en la capa oculta
      let whoT = Matrix.transpose(this.weightsHiddenOutput);
      let hiddenErrors = Matrix.multiply(whoT, outputErrors);
  
      let hiddenGradient = Matrix.map(hidden, this.sigmoidDerivada);
      hiddenGradient.multiply(hiddenErrors);
      hiddenGradient.multiply(this.learningRate);
  
      let inputsT = Matrix.transpose(inputs);
      let weightsInputHiddenDeltas = Matrix.multiply(hiddenGradient, inputsT);
  
      this.weightsInputHidden.add(weightsInputHiddenDeltas);
    }
  
    // Realizar una predicción
    predict(inputArray) {
      let inputs = Matrix.fromArray(inputArray);
  
      // --- Forward Propagation ---
      let hidden = Matrix.multiply(this.weightsInputHidden, inputs);
      hidden.map(this.sigmoid);
  
      let outputs = Matrix.multiply(this.weightsHiddenOutput, hidden);
      outputs.map(this.sigmoid);
  
      return outputs.toArray();
    }
  }
  
  // Implementación simple de una matriz para simplificar el código
  class Matrix {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }
  
    randomize() {
      this.data = this.data.map(row => row.map(() => Math.random() * 2 - 1));
    }
  
    static fromArray(arr) {
      return new Matrix(arr.length, 1).map((_, i) => arr[i]);
    }
  
    toArray() {
      return this.data.flat();
    }
  
    map(func) {
      this.data = this.data.map(row => row.map((val, i, j) => func(val, i, j)));
      return this;
    }
  
    static transpose(matrix) {
      return new Matrix(matrix.cols, matrix.rows).map((_, i, j) => matrix.data[j][i]);
    }
  
    static multiply(a, b) {
      if (a.cols !== b.rows) {
        console.error('Número de columnas de la matriz A debe ser igual al número de filas de la matriz B');
        return undefined;
      }
  
      return new Matrix(a.rows, b.cols).map((_, i, j) => {
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
    }
  
    static subtract(a, b) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        console.error('Las matrices deben tener la misma dimensión');
        return undefined;
      }
  
      return new Matrix(a.rows, a.cols).map((_, i, j) => a.data[i][j] - b.data[i][j]);
    }
  
    multiply(n) {
      if (n instanceof Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          console.error('Las matrices deben tener la misma dimensión');
          return undefined;
        }
  
        return this.map((val, i, j) => val * n.data[i][j]);
      } else {
        return this.map(val => val * n);
      }
    }
  
    add(n) {
      if (n instanceof Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          console.error('Las matrices deben tener la misma dimensión');
          return undefined;
        }
  
        return this.map((val, i, j) => val + n.data[i][j]);
      } else {
        return this.map(val => val + n);
      }
    }
  
    static map(matrix, func) {
      return new Matrix(matrix.rows, matrix.cols).map((_, i, j) => func(matrix.data[i][j], i, j));
    }
  }
  
  // Ejemplo de uso
  let red = new RedNeuronal(2, 3, 1, 0.1);
  
  for (let i = 0; i < 10000; i++) {
    let inputs = [Math.random(), Math.random()];
    let target = [inputs[0] + inputs[1]];
  
    red.train(inputs, target);
  }
  
  let prueba = red.predict([0.5, 0.2]);
  console.log(prueba); // Debería imprimir un valor cercano a 0.7
  