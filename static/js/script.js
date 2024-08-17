let map;
let markers = [];

function initializeMap() {
    // 지도 초기화
    map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 12,
        mapTypeControl: false
    });

    // 검색 기능 설정
    setupSearch(map, 'search-button', 'search-input');

    // 자전거길 레이어 설정
    manageBicycleLayer(map, 'bicycle-button')

    // 줌 레벨에 따라 마커를 표시하거나 숨기는 함수 호출
    manageMarkersOnZoom(map, markers, 16);
}

// 마커를 생성하는 함수
function createMarkers(locations) {
    return locations.map(location => {
        let markerOptions = {
            position: new naver.maps.LatLng(location.latitude, location.longitude),
            map: null,  // 초기에는 마커를 지도에 표시하지 않음
            icon: {
                url: bicycleIconUrl,
            }
        };
        let marker = new naver.maps.Marker(markerOptions);

        // 정보 창 설정
        let infowindow = new naver.maps.InfoWindow({
            content: `<div style="color: #2a9d8f;"><strong>${location.contents_name}</strong></div>
                    <div style="color: #264653;">${location.addr}</div>`
        });

        // 마우스 오버 시 정보 창 열기
        naver.maps.Event.addListener(marker, 'mouseover', function() {
            infowindow.open(map, marker);
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } 

            marker.setAnimation(naver.maps.Animation.BOUNCE);
        });

        // 마우스 아웃 시 정보 창 닫기
        naver.maps.Event.addListener(marker, 'mouseout', function() {
            infowindow.close();
            marker.setAnimation(null);
        });

        return marker;
    });
}

// 줌 레벨에 따라 마커를 표시하거나 숨기는 함수
function manageMarkersOnZoom(map, markers, thresholdZoom) {
    naver.maps.Event.addListener(map, 'zoom_changed', function() {
        let zoom = map.getZoom();
        if (zoom >= thresholdZoom) {
            markers.forEach(marker => marker.setMap(map));
        } else {
            markers.forEach(marker => marker.setMap(null));
        }
    });
}

// 자전거 도로 레이어를 관리하는 함수
function manageBicycleLayer(map, buttonId) {
    let bicycleLayer = new naver.maps.BicycleLayer();
    let button = document.getElementById(buttonId);

    button.addEventListener('click', function() {
        if (bicycleLayer.getMap()) {
            bicycleLayer.setMap(null);
            button.style.backgroundColor = '#4CAF50';
        } else {
            bicycleLayer.setMap(map);
            button.style.backgroundColor = '#790848';
        }
    });
}

function setupSearch(map, searchButtonId, searchInputId) {
    let searchButton = document.getElementById(searchButtonId);
    let searchInput = document.getElementById(searchInputId);

    searchButton.addEventListener('click', function() {
        let searchQuery = searchInput.value.trim();

        if (searchQuery.length === 0) {
            alert('검색어를 입력하세요.');
            return;
        }

        // 검색 버튼 비활성화 및 로딩 상태 표시
        searchButton.disabled = true;
        searchButton.textContent = '검색 중...';

        // 쿼리 문자열을 포함한 URL을 작성
        let url = `/?contents_name=${encodeURIComponent(searchQuery)}`;

        fetch(url, {
            method: 'GET',
            headers: {
                // 서버에 JSON 응답을 요청.
                'Accept': 'application/json'  
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 상태가 좋지 않습니다. ' + response.statusText);
            }
            return response.json();  
        })
        .then(data => {
            searchButton.disabled = false;
            searchButton.textContent = '검색';

            // 기존 검색 결과 컨테이너를 제거
            let oldResultsContainer = document.getElementById('results-container');
            if (oldResultsContainer) {
                oldResultsContainer.remove();
            }

            // 새로운 검색 결과 컨테이너 생성
            let resultsContainer = document.createElement('div');
            resultsContainer.id = 'results-container';
            resultsContainer.classList.add('results-container'); 

            if (data.status === 'success') {
                let locations = data.locations;

                // 결과 컨테이너 초기화
                locations.forEach(location => {
                    let locationElement = document.createElement('div');
                    locationElement.classList.add('result-item');

                    locationElement.innerHTML = `
                        <p>주소: ${location.addr}</p>
                        <button onclick="moveToLocation(${location.latitude}, ${location.longitude})">${location.contents_name}</button>`;
                    resultsContainer.appendChild(locationElement);
                });

                // 결과 컨테이너를 main-content에 추가
                document.getElementById('main-content').appendChild(resultsContainer);

                // 기존 마커 제거
                removeMarkers();

                // 마커 생성 및 지도에 추가
                markers = createMarkers(locations);
                manageMarkersOnZoom(map, markers, 16);  // 줌 레벨에 따라 마커 표시 관리
            } else {
                resultsContainer.innerHTML = '<p>검색 결과가 없습니다. 다시 입력해 주세요.</p>';
                document.getElementById('main-content').appendChild(resultsContainer);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            searchButton.disabled = false;
            searchButton.textContent = '검색';
            alert('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
        });
    });
}

// 지도에서 위치로 이동하는 함수
function moveToLocation(lat, lng) {
    let newCenter = new naver.maps.LatLng(lat, lng);
    map.setCenter(newCenter);
    map.setZoom(16);  // 이동 후 줌 레벨을 16으로 설정
}

// 기존 마커 제거 함수
function removeMarkers() {
    markers.forEach(marker => marker.setMap(null));
}

// 페이지 로드 시 지도 초기화
window.onload = initializeMap;
