// const aspectW = 4;
const aspectW = 0;
const aspectH = 3;
const container = document.body.querySelector('.container-canvas');

let ngonCnt = document.querySelector('input'); // n각형 불러오기

function setup() {
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  if (aspectW === 0 || aspectH === 0) {
    createCanvas(containerW, containerH).parent(container);
  }
  else if (containerW / containerH > aspectW / aspectH) {
    createCanvas((containerH * aspectW) / aspectH, containerH).parent(
      container
    );
  }
  else {
    createCanvas(containerW, (containerW * aspectH) / aspectW).parent(
      container
    );
  }
  init();
}

function init() {
  colorMode(HSB, 360, 100, 100);
  noFill();
  strokeJoin(ROUND); // 꼭짓점 안삐져나가도록 모서리 굴림
  strokeWeight(2);
}

function draw() {
  background(0, 0, 15);
  ngonDraw();
}

function windowResized() {
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  if (aspectW === 0 || aspectH === 0) {
    resizeCanvas(containerW, containerH);
  }
  else if (containerW / containerH > aspectW / aspectH) {
    resizeCanvas((containerH * aspectW) / aspectH, containerH);
  }
  else {
    resizeCanvas(containerW, (containerW * aspectH) / aspectW);
  }
  init();
}

function ngonDraw() {
  let radius = min(width, height) * .4; // 최대 크기 반지름 설정
  let maxRepeat = 1000; // 그리기 최대 반복 수(변경가능)
  let repeatCnt = int(map(mouseX, 0, width, 1, maxRepeat + 1)); // 그리기 반복 수 설정(마우스X에 따라)
  let ratio = int(map(mouseY, 0, height, 1, 100)) / 100; // 분할점 위치 설정(마우스Y에 따라)
  let ngonValue = int(ngonCnt.value); // n각형 정수화 저장
  let verticesArr = []; // 꼭짓점 위치 저장 배열(그리는 데 사용할 좌표)

  if (ratio < 0 || ratio > 1) { // 마우스 화면 밖으로 드래그 했을 때 버그 방지
    repeatCnt = int(map(mouseX, 0, width, 1, 40));
    if (mouseX > width) {
      repeatCnt = 40; // 너무 많아지면 뭉개져서 개수 제한
    }
  }
  if (mouseX < 0) { // 최초 다각형 사라지는것 방지
    repeatCnt = 1; // 최소 1개
  }

  translate(width * .5, height * .5); // 중심점 기준 설정
  
  for (let ngon = 0; ngon < ngonValue; ngon++) { // 초기 도형 설정
    let rotationAng = radians(360 / ngonValue * ngon - 90); // 슬라이더값에 따른 각도 설정(90도 빼서 초기값을 기준점 기준 수직 설정)
    let x = cos(rotationAng) * radius; // 각도를 통한 꼭짓점 위치 산출
    let y = sin(rotationAng) * radius;
    verticesArr.push({x, y});
  }

  for (let repeat = 0; repeat < repeatCnt; repeat++) {
    let nextVerticesArr = []; // 다음 도형 꼭짓점 위치 저장 배열 생성
    beginShape();
    let hue = map(repeat, 0, repeatCnt, 0, 360); // 도형 작아지며 색 변화
    let hueV = (hue + (millis() * .05)) % 360; // 시간에 따라 색 변화
    stroke(hueV, 20, 80); // 색 적용
    for (let vertexIdx = 0; vertexIdx < verticesArr.length; vertexIdx++) { // 도형 꼭짓점 좌표 생성 반복문
      let thisVertex = verticesArr[vertexIdx];
      let nextVertex = verticesArr[(vertexIdx + 1) % verticesArr.length];

      let newX = lerp(thisVertex.x, nextVertex.x, ratio); // ChatGPT 사용하여 두 점 사이의 거리에서 특정 비의 좌표를 구할 때 lerp 내장함수 활용가능한 것을 인지함
      let newY = lerp(thisVertex.y, nextVertex.y, ratio); // 다음 도형 꼭짓점 좌표 산출
      nextVerticesArr.push({x: newX, y: newY}); // 다음 도형 꼭짓점 저장
      vertex(thisVertex.x, thisVertex.y); // 그릴 점 추가
    }
    endShape(CLOSE);

    verticesArr = nextVerticesArr; // 다음 도형 좌표 그릴 도형 좌표에 적용
  }
}