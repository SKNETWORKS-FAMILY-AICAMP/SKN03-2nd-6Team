document.addEventListener('DOMContentLoaded', function() {
    fetch('data.csv') // CSV 파일을 서버에서 가져옵니다.
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(text => parseCSV(text))
        .catch(error => console.error('Error fetching the CSV file:', error));

    function parseCSV(text) {
        const table = document.getElementById('csvTable');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        // 기존 테이블 내용 지우기
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // CSV 데이터를 줄 단위로 나누기
        const rows = text.split('\n').filter(row => row.trim() !== '');
        if (rows.length === 0) return;

        // 첫 번째 줄은 헤더로 사용
        const headerRow = rows[0].split(',');
        const theadRow = document.createElement('tr');
        headerRow.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            theadRow.appendChild(th);
        });
        thead.appendChild(theadRow);

        // 나머지 줄은 테이블 본문으로 추가
        rows.slice(1).forEach(row => {
            const rowData = row.split(',');
            const tr = document.createElement('tr');
            rowData.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
});
