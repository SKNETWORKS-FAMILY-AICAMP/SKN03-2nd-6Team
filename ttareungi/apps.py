from django.apps import AppConfig


class ttareungiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ttareungi'


from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# 데이터베이스 URI 설정 (자신의 DB URI로 대체)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://member:entercheck@bicycledb.c36wsekg0wgk.ap-northeast-2.rds.amazonaws.com:3306/BicycleDB'  # 예시: SQLite 사용
db = SQLAlchemy(app)

class BicycleRentalStatus(db.Model):
    rental_id = db.Column(db.Integer, primary_key=True)
    rental_date = db.Column(db.Date)
    rental_count = db.Column(db.Integer)

@app.route('/')
def index():
    return render_template('ttareungi/index.html')

@app.route('/rental-data')
def rental_data():
    data = BicycleRentalStatus.query.order_by(BicycleRentalStatus.rental_date).all()
    rental_data = {
        "labels": [record.rental_date.strftime("%Y-%m-%d") for record in data],
        "counts": [record.rental_count for record in data]
    }
    return jsonify(rental_data)

if __name__ == '__main__':
    app.run(debug=True)
