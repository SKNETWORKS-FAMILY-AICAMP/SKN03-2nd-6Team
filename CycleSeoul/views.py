from django.shortcuts import render
from django.http import JsonResponse
from .models import facilities_location

def search_location(request):
    # 기본 페이지를 반환
    if 'contents_name' not in request.GET:
        return render(request, 'CycleSeoul/NaverMap.html')

    input_contents_name = request.GET.get("contents_name", "").strip()

    if len(input_contents_name) <= 1:
        return JsonResponse({'status': 'error', 'message': '검색어는 최소 두 글자 이상이어야 합니다.'})

    location_sql = facilities_location.objects.filter(contents_name__icontains=input_contents_name)

    if not location_sql.exists():
        return JsonResponse({'status': 'error', 'message': '검색 결과가 없습니다. 다시 입력해주세요.'})

    locations = list(location_sql.values('facil_lo_id', 'contents_name', 'addr', 'latitude', 'longitude'))
    return JsonResponse({'status': 'success', 'locations': locations})