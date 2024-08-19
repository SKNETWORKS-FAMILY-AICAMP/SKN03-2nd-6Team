from django.db import models




class TtareungiLocation(models.Model):
    rental_lo_id = models.CharField(max_length=10, primary_key=True)
    addr1 = models.CharField(max_length=100)
    addr2 = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        db_table = 'ttareungi_location'  # 실제 데이터베이스 테이블 이름과 일치시킴

    def __str__(self):
        return self.addr2
    



