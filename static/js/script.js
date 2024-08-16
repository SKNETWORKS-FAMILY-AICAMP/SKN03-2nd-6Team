var mapDiv = document.getElementById('map'); 
        var map = new naver.maps.Map(mapDiv, {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 12,  // 기본 줌 레벨 설정
            mapTypeControl: false  // 드롭다운 형태의 지도 유형 선택 제거
        });

        // 임시 데이터: 서울 내 위치 데이터
        var locations = [
            { name: "Location 1", lat: 37.5665, lng: 126.9780 },
            { name: "Location 2", lat: 37.5700, lng: 126.9860 },
            { name: "Location 3", lat: 37.5760, lng: 126.9920 }
        ];

        // 마커들을 저장할 배열
        var markers = [];

        // 위치 데이터에 따라 마커 생성하지만 초기에는 지도를 표시하지 않음
        locations.forEach(function(location) {
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(location.lat, location.lng),
                map: null  // 초기에는 마커를 지도에 표시하지 않음
            });
            markers.push(marker);
        });

        // 줌 레벨에 따라 마커 표시/숨기기
        naver.maps.Event.addListener(map, 'zoom_changed', function() {
            var zoom = map.getZoom();  // 현재 줌 레벨을 가져옴
            if (zoom >= 16) {
                markers.forEach(function(marker) {
                    marker.setMap(map);  // 마커를 지도에 표시
                });
            } else {
                markers.forEach(function(marker) {
                    marker.setMap(null);  // 마커를 지도에서 제거
                });
            }
        });

        // 자전거 도로 레이어 추가
        var bicycleLayer = new naver.maps.BicycleLayer();

        // 자전거길 버튼에 클릭 이벤트 추가
        document.getElementById('bicycle-button').addEventListener('click', function() {
            if (bicycleLayer.getMap()) {
                bicycleLayer.setMap(null); // 자전거길 레이어 제거
                this.style.backgroundColor = '#4CAF50'; // 버튼 색상 복원
            } else {
                bicycleLayer.setMap(map); // 자전거길 레이어 추가
                this.style.backgroundColor = '#790848'; // 버튼 색상 변경
            }
        });

        // 검색 기능
        document.getElementById('search-button').addEventListener('click', function() {
            var searchQuery = document.getElementById('search-input').value;
            
            if (searchQuery) {
                fetch(`/search-location/?query=${searchQuery}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            var location = data.location;
                            var newCenter = new naver.maps.LatLng(location.lat, location.lng);
                            map.setCenter(newCenter);
                            // 마커 위치도 이동
                            markers.forEach(function(marker) {
                                marker.setPosition(newCenter);
                            });
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                alert('검색어를 입력하세요.');
            }
        });