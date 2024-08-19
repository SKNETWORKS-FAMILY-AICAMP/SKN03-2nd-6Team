from django.db import models

class facilities_location(models.Model):
    facil_lo_id = models.CharField(max_length=100, primary_key=True)
    contents_name = models.CharField(max_length=100)
    addr = models.CharField(max_length=100) 
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        db_table = 'facilities_location'  # 데이터베이스에서 사용할 테이블 이름
    
    def __str__(self):
        return self.contents_name