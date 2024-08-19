from django.shortcuts import render
from .models import TtareungiLocation 
import folium
from folium.plugins import MarkerCluster
from folium import IFrame

def map_view(request):
    
    locations = TtareungiLocation.objects.all()

    m = folium.Map(location=[37.532618, 127.028101], tiles='openstreetmap', zoom_start=12)

    # MarkerCluster 객체 생성
    marker_cluster = MarkerCluster().add_to(m)

    # DB에서 가져온 데이터를 바탕으로 마커 추가
    for location in locations:
        popup_content = f"""
        <div style="width: 300px; font-size: 12pt;">
            <strong>{location.addr1}</strong><br>
            {location.addr2}<br>
            대여번호: {location.rental_lo_id}
        </div>
        """

        iframe = IFrame(popup_content, width=300, height=100)
        popup = folium.Popup(iframe, max_width=500)

        folium.Marker(
            location=[location.latitude, location.longitude],  # 모델에서 위도, 경도 필드 사용
            popup=popup,  # 모델에서 시설명 필드 사용
        ).add_to(marker_cluster)
    
    # Folium 지도를 HTML로 렌더링
    map_html = m._repr_html_()

    # 템플릿에 map_html을 전달
    return render(request, 'todolist/index.html', {'map_html': map_html})


