const glowingBtn = document.getElementById('glowingBtn');
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const formContainers = document.querySelectorAll('.form-container');
const shapes = [];
const history = []; // Array to store history of shapes
const redoHistory = []; // Array to store redo history of shapes

let isDragging = false;  // To track a shape is being dragged
let selectedShape = null;  // To store selected shape during dragging

function toggleCanvasAndForms() {
    glowingBtn.style.display = 'none';
    canvas.style.display = 'block';

    const rectangleButton = document.getElementById('createRectangleBtn');
    const circleButton = document.getElementById('createCircleBtn');
    rectangleButton.style.display = 'inline-block';
    circleButton.style.display = 'inline-block';
    
    for (let i = 0; i < formContainers.length; i++) {
        formContainers[i].style.display = 'flex';
    }

    instructionsBox.classList.remove('hide');
    instructionsBox.classList.add('show');
}

document.addEventListener("DOMContentLoaded", function () {
    
    glowingBtn.addEventListener('click', handleGlowingBtnClick);

    function handleGlowingBtnClick() {
        toggleCanvasAndForms();
        showTriangleForm();
        glowingBtn.classList.add('hide');

        document.body.classList.add('glowing-btn-clicked');
    }



    canvas.addEventListener('contextmenu', handleCanvasContextMenu);

    // Function to add a copy of the shapes array to the history
    function addToHistory() {
        history.push(shapes.slice());
    }

    // Function to add a copy of the shapes array to the redo history
    function addToRedoHistory() {
        redoHistory.push(shapes.slice());
    }

    // Event listener for the undo button
    const undoBtn = document.getElementById('undoBtn');
    undoBtn.addEventListener('click', undoAction);

    // Function to handle undo action
    function undoAction() {
        if (history.length > 0) {
            // Pop the last state from history
            const previousState = history.pop();

            // Add the current state to redo history
            addToRedoHistory();

            // Replace current shapes array with previous state
            shapes.length = 0;
            shapes.push(...previousState);

            // Redraw canvas with updated shapes
            drawShapes();
        }
    }

    // Event listener for the redo button
    const redoBtn = document.getElementById('redoBtn');
    redoBtn.addEventListener('click', redoAction);

    // Function to handle redo action
    function redoAction() {
        if (redoHistory.length > 0) {
            // Pop the last state from redo history
            const nextState = redoHistory.pop();

            // Add the current state to undo history
            addToHistory();

            // Replace the current shapes array with next state
            shapes.length = 0;
            shapes.push(...nextState);

            // Redraw canvas with updated shapes
            drawShapes();
        }
    }

    function showTriangleForm() {
        triangleForm.style.display = 'flex';
    }

    

    function drawShapes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            ctx.fillStyle = shape.color;
    
            switch (shape.type) {
                case 'Rectangle':
                    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                    break;
                case 'Circle':
                    ctx.beginPath();
                    ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
                case 'Triangle':
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y + shape.height);
                    ctx.lineTo(shape.x + shape.width / 2, shape.y);
                    ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
        }
    }

    function createShape(type, color, width, height) {
        return {
            type: type,
            color: color,
            width: width,
            height: height,
            x: 0,
            y: 0,
            fixed: false
        };
    }

    function setPosition(shape, position) {
        const rect = canvas.getBoundingClientRect();
    
        switch (position) {
            case 'top-right':
                shape.x = rect.width - shape.width;
                shape.y = 0;
                break;
            case 'top-center':
                shape.x = (rect.width - shape.width) / 2;
                shape.y = 0;
                break;
            case 'top-left':
                shape.x = 0;
                shape.y = 0;
                break;
            case 'right-center':
                shape.x = rect.width - shape.width;
                shape.y = (rect.height - shape.height) / 2;
                break;
            case 'center':
                shape.x = (rect.width - shape.width) / 2;
                shape.y = (rect.height - shape.height) / 2;
                break;
            case 'left-center':
                shape.x = 0;
                shape.y = (rect.height - shape.height) / 2;
                break;
            case 'bottom-right':
                shape.x = rect.width - shape.width;
                shape.y = rect.height - shape.height;
                break;
            case 'bottom-center':
                shape.x = (rect.width - shape.width) / 2;
                shape.y = rect.height - shape.height;
                break;
            case 'bottom-left':
                shape.x = 0;
                shape.y = rect.height - shape.height;
                break;
            default:
                break;
        }
    }

    const rectangleForm = document.getElementById('rectangleForm');
    rectangleForm.addEventListener('submit', function (event) {
        event.preventDefault();
        createRectangle();
    });

    const circleForm = document.getElementById('circleForm');
    circleForm.addEventListener('submit', function (event) {
        event.preventDefault();
        createCircle();
    });

    const triangleForm = document.getElementById('triangleForm');
    triangleForm.addEventListener('submit', function (event) {
        event.preventDefault();
        createTriangle();
    });

    function createRectangle() {
        const width = parseInt(document.getElementById('rectangleWidth').value);
        const height = parseInt(document.getElementById('rectangleHeight').value);
        const color = document.getElementById('rectangleColor').value;
        const position = document.getElementById('rectanglePosition').value;

        addToHistory();
        const shape = createShape('Rectangle', color, width, height);
        setPosition(shape, position);
        shapes.push(shape);
        drawShapes();
        resetForm('rectangleForm');
    }

    function createCircle() {
        const radius = parseInt(document.getElementById('circleRadius').value);
        const color = document.getElementById('circleColor').value;
        const position = document.getElementById('circlePosition').value;

        addToHistory(); 
        const shape = createShape('Circle', color, radius * 2, radius * 2);
        setPosition(shape, position);
        shapes.push(shape);
        drawShapes();
        resetForm('circleForm');
    }

    function createTriangle() {
        const base = parseInt(document.getElementById('triangleBase').value);
        const height = parseInt(document.getElementById('triangleHeight').value);
        const color = document.getElementById('triangleColor').value;
        const position = document.getElementById('trianglePosition').value;

        addToHistory();
        const shape = createShape('Triangle', color, base, height);
        setPosition(shape, position);
        shapes.push(shape);
        drawShapes();
        resetForm('triangleForm');
    }

    function handleCanvasMouseDown(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];
            if (
                x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
            ) {
                if (!shape.fixed) {
                    isDragging = true;
                    selectedShape = shape;
    
                    selectedShape.dragStartX = x - shape.x;
                    selectedShape.dragStartY = y - shape.y;
    
                    shapes.splice(i, 1);
                    shapes.push(selectedShape);
    
                    drawShapes();
                }
    
                break;
            }
        }
    }
    
    function handleCanvasMouseMove(event) {
        if (isDragging && selectedShape) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            if (!selectedShape.fixed) {
            
                selectedShape.x = x - selectedShape.dragStartX;
                selectedShape.y = y - selectedShape.dragStartY;
    
                drawShapes();
            }
        }
    }

    function handleCanvasMouseUp() {
        isDragging = false;
        selectedShape = null;
    }

    function handleCanvasContextMenu(event) {
        event.preventDefault();
    
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];
            if (
                x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
            ) {
                if (shape.fixed) {

                    const unfixOption = window.confirm('Unfix this shape at its current position?');
                    if (unfixOption) {
                        addToHistory(); 
                        shape.fixed = false;
                        drawShapes();
                    }
                } else {
                    
                    const fixOption = window.confirm('Fix this shape at its current position?');
                    if (fixOption) {
                        addToHistory(); 
                        shape.fixed = true;
                        drawShapes();
                    }
                }
    
                break;
            }
        }
    }
    document.getElementById('undoBtn').addEventListener('click', undoAction);
    document.getElementById('redoBtn').addEventListener('click', redoAction);
    document.getElementById('createTriangleBtn').addEventListener('click', createTriangle);
    document.getElementById('createRectangleBtn').addEventListener('click', createRectangle);
    document.getElementById('createCircleBtn').addEventListener('click', createCircle);

    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
});