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

/*
// 아래는 시험용으로 작성한 코드이므로 참고용으로 쓰시고
// Html에 해당하는 id 추가, for문 수정 부탁드립니다

// 비디오 정보를 이미지와 함께 표시
async function displayVideos() {
    const videoList = await getVideoList();
    const imageContainer = document.getElementById('(id)');
    const infoContainer = document.getElementById('(id)');

    for (let i = 0; i < videoList.length; i++) {
        const videoId = videoList[i].video_id;
        const videoInfo = await getVideoInfo(videoId);

        // 이미지 생성과 추가
        const image = new Image();
        image.src = videoInfo.image_link;
        imageContainer.appendChild(image);

        // 비디오 정보를 표시할 문자열 생성
        const infoHTML = `
            <p>${videoInfo.video_title}</p>
            <p>${videoInfo.video_channel}</p>
            <p>${videoInfo.views}</p>
            <p>${videoInfo.upload_date}</p>
        `;

        // 비디오 정보 추가
        infoContainer.innerHTML += infoHTML;
    }
}
*/

// 페이지가 로드되면 비디오 정보를 가져와서 표시
document.addEventListener('DOMContentLoaded', () => {
    displayVideos().catch(error => {
        console.error('유튜브 정보를 가져오는데 실패했습니다. ', error);
    });
});
