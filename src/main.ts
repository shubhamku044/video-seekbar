const videoCon: HTMLDivElement = document.querySelector(
  "#video-con"
) as HTMLDivElement;
const btn = document.getElementById("btn");
const videoEl: HTMLVideoElement = videoCon.getElementsByTagName("video")[0];
const controlBar = videoCon.querySelector(".vjs-control-bar");
const controlProgress = videoCon.querySelector(".vjs-progress-control");

type Chapter = {
  index: number;
  timestamp: string;
  chapterName: string;
};

const chaptersTimestamps: Chapter[] = [
  {
    index: 0,
    timestamp: "00:00",
    chapterName: "Introduction",
  },
  {
    index: 1,
    timestamp: "00:30",
    chapterName: "About Cohort 2.0",
  },
  {
    index: 2,
    timestamp: "01:32",
    chapterName: "Frontend",
  },
  {
    index: 3,
    timestamp: "02:40",
    chapterName: "Backend",
  },
  {
    index: 4,
    timestamp: "03:00",
    chapterName: "Database",
  },
  {
    index: 5,
    timestamp: "03:10",
    chapterName: "Deployment",
  },
];

const horizontalProgress = videoCon.getElementsByClassName(
  "vjs-progress-holder"
)[0];
const timeStampCon = document.querySelector(".time-stamp");

function addTimestampDetails() {
  const timeStampCon = document.querySelector(".time-stamp");
  chaptersTimestamps.forEach((chapter) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const button = document.createElement("button");

    button.addEventListener("click", (e) => {
      e.preventDefault();
      videoEl.currentTime = timestampToSeconds(chapter.timestamp);
      videoEl.play();
    });

    p.innerText = chapter.chapterName;
    button.innerHTML = chapter.timestamp;
    li.appendChild(p);
    li.appendChild(button);
    timeStampCon?.appendChild(li);
  });
}

const skip = (time: number) => {
  videoEl.currentTime = videoEl.currentTime + time;
};
const forward = () => {
  skip(15);
};

const backward = () => {
  skip(-15);
};

document.addEventListener("keydown", (e: KeyboardEvent) => {
  console.log(e.key);
  if (e.key === "ArrowRight") {
    forward();
  }
  if (e.key === "ArrowLeft") {
    backward();
  }
});

function timestampToSeconds(timestamp: string): number {
  let hours: number;
  let minutes: number;
  let seconds: number;
  const timestampArr = timestamp.split(":");
  if (timestampArr.length === 3) {
    hours = +timestampArr[0];
    minutes = +timestampArr[1];
    seconds = +timestampArr[2];
  } else {
    hours = 0;
    minutes = +timestampArr[0];
    seconds = +timestampArr[1];
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return totalSeconds;
}

(horizontalProgress as HTMLDivElement).addEventListener(
  "mouseover",
  () => {
    const marker = document.querySelector(".marker");
    (marker as HTMLDivElement).style.height = "5px";
  },
  false
);
(horizontalProgress as HTMLDivElement).addEventListener(
  "mouseout",
  (e) => {
    const marker = document.querySelector(".marker");
    (marker as HTMLDivElement).style.height = "3px";
  },
  false
);

function addChapters(chapters: Chapter[], el: HTMLDivElement) {
  const videoLength = videoEl.duration;
  (controlBar as HTMLDivElement).style.height = "40px";
  (controlProgress as HTMLDivElement).style.paddingBottom = "10px";
  const div = document.createElement("div");
  div.setAttribute("class", "chapter-name");
  div.style.position = "absolute";
  div.style.left = "10px";
  div.style.bottom = "6px";
  div.style.fontSize = "0.8rem";
  div.innerText = "Hello";
  controlProgress?.appendChild(div);
  chapters.forEach((chapter) => {
    const divEl = document.createElement("div");
    divEl.setAttribute("class", "marker");
    divEl.style.width = "10px";
    divEl.style.height = "4px";
    divEl.style.background = "red";
    divEl.style.position = "absolute";
    divEl.style.top = "50%";
    divEl.style.transform = "translateY(-50%)";
    divEl.style.cursor = "pointer";
    divEl.style.zIndex = "1000";
    const timestamp = timestampToSeconds(chapter.timestamp);
    if (timestamp >= videoLength) return;
    divEl.style.left = `${(timestamp / videoLength) * 100}%`;
    el.appendChild(divEl);
  });
}

videoEl.addEventListener("loadeddata", () => {
  if (videoEl.readyState >= 3) {
    addTimestampDetails();
    addChapters(chaptersTimestamps, horizontalProgress as HTMLDivElement);
  }
});

videoEl.addEventListener("timeupdate", () => {
  const chapterEl = document.querySelector(".chapter-name");
  const time = videoEl.currentTime;

  const els = chaptersTimestamps.filter(
    (chapter) => timestampToSeconds(chapter.timestamp) < time
  );
  const chapterName = els[els.length - 1].chapterName;

  if (chapterEl && !(chapterEl?.innerHTML === chapterName)) {
    chapterEl.innerHTML = chapterName;
  }
});
