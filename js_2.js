// 비디오 리스트 가져오기
async function getVideoList() {
    const response = await fetch('http://oreumi.appspot.com/video/getVideoList');
    const data = await response.json();
    return data;
}

// 비디오 정보 가져오기
async function getVideoInfo(videoId) {
    const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 채널 정보 가져오기
async function getChannelVideo() {
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=oreumi`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// index_home.html에서 화면 표시
async function displayHome() {
    const videoList = await getVideoList();
    const infoContainer = document.getElementById('videoList');
    let infoHTML = "";
    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = videoInfoList[i];

        // 비디오 정보를 표시할 문자열 생성
        let channelURL = `location.href="./index_channel.html"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        infoHTML += `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div style='display:flex;'>
                    <div style='width:30px; height: 30px; border-radius: 70%; overflow:hidden;'>
                        <img src='/img/css_1_header/oreumi.jpg' style='width:100%; height:100%; object-fit:cover; cursor:pointer;' onclick='${channelURL}'></img>
                    </div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${videoInfo.views}</p>
                        <p>${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 비디오 정보 추가
    infoContainer.innerHTML = infoHTML;
}
// index_video.html 에서 화면 표시
async function displayVideo(id) {
    const videoList = await getVideoList();
    let video = document.getElementById('videoInfo');
    let listContainer = document.getElementById('videolist');
    let listHTML = "";
    let videoHTML = "";
    // 비디오 정보와 채널 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = videoInfoList[i];

        // 비디오 정보를 표시할 문자열 생성
        let channelURL = `location.href="./index_channel.html"`;
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        if (id == videoId){
            videoHTML = `
            <video controls style='width:800px'>
                <source src='${videoInfo.video_link}'>
            </video>    
            `;
        }else{
            listHTML += `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div style='display:flex;'>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${videoInfo.views}</p>
                        <p>${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
        `;
        }
        
    } 
    // 선택된 비디오
    video.innerHTML = videoHTML;
    // 비디오 리스트 추가
    listContainer.innerHTML = listHTML;
   
}
// index_channel.html 에서 화면 표시
async function displayChannel() {
    const videoList = await getVideoList();
    const infoContainer = document.querySelector('.playlist');
    let infoHTML = "";

    // 비디오 정보를 병렬로 가져오기
    const videoInfoPromises = videoList.slice(0, 10).map((video) => getVideoInfo(video.video_id));
    const videoInfoList = await Promise.all(videoInfoPromises);

    for (let i = 0; i < videoInfoList.length; i++) {
        const videoInfo = videoInfoList[i];
        const videoId = videoInfo.video_id;

        // 비디오 정보를 표시할 문자열 생성
        let videoURL = `location.href="./index_video.html?id=${videoId}"`;

        infoHTML += `
            <div>
                <img src='${videoInfo.image_link}' style='width:320px;cursor:pointer;' onclick='${videoURL}'></img>
                <div>
                    <div>
                        <p>${videoInfo.video_title}</p>
                        <p>${videoInfo.video_channel}</p>
                        <p>${videoInfo.views}</p>
                        <p>${videoInfo.upload_date}</p>
                    </div>
                </div>
            </div>
        `;
    }

    infoContainer.innerHTML = infoHTML;
}
