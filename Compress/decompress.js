const fs = require('fs').promises;

async function decompressJSON(inputFile, outputFile) {
    try {
        // Đọc file nén
        const compressedData = await fs.readFile(inputFile, 'utf8');
        const { q: query, d: compressedEvents } = JSON.parse(compressedData);

        // Rules giải nén (đảo ngược của rules nén)
        const decompressRules = {
            'i': 'id',
            's': 'season_id',
            'g': 'stage_id',
            'n': 'group_num',
            'r': 'round_num',
            't': 'start_time',
            'p': 'start_timestamp',
            'e': 'sport_event_status',
            'd': 'status_id',
            'u': 'updated_at',
            'c': 'record_updated_at',
            'h': 'home_team_id',
            'a': 'away_team_id',
            'o': 'competition_id',
            'l': 'lineup',
            'v': 'venue_id',
            'f': 'referee_id',
            'x': 'related_id',
            'y': 'agg_score',
            'cr': 'corners',
            'rd': 'red_card',
            'yd': 'yellow_card',
            'ps': 'penalty_score',
            'rs': 'regular_score',
            'os': 'overTime_score',
            'hs': 'half_time_score',
            'as': 'away_score'
        };

        // Giải nén từng event
        const decompressedEvents = compressedEvents.map(event => {
            const decompressed = {};

            for (const [key, value] of Object.entries(event)) {
                const originalKey = decompressRules[key] || key;

                if (key === 'e' && typeof value === 'object') {
                    // Giải nén sport_event_status
                    const status = {
                        status_id: value.d,
                        away_score: {
                            corners: 0,
                            red_card: 0,
                            yellow_card: 0,
                            penalty_score: 0,
                            regular_score: 0,
                            overTime_score: 0,
                            half_time_score: 0
                        },
                        home_score: {
                            corners: 0,
                            red_card: 0,
                            yellow_card: 0,
                            penalty_score: 0,
                            regular_score: 0,
                            overTime_score: 0,
                            half_time_score: 0
                        }
                    };

                    // Giải nén away_score và home_score
                    if (value.a) {
                        for (const [scoreKey, scoreValue] of Object.entries(value.a)) {
                            const originalScoreKey = decompressRules[scoreKey] || scoreKey;
                            status.away_score[originalScoreKey] = scoreValue;
                        }
                    }

                    if (value.h) {
                        for (const [scoreKey, scoreValue] of Object.entries(value.h)) {
                            const originalScoreKey = decompressRules[scoreKey] || scoreKey;
                            status.home_score[originalScoreKey] = scoreValue;
                        }
                    }

                    decompressed[originalKey] = JSON.stringify(status);
                } else {
                    decompressed[originalKey] = value;
                }
            }

            // Thêm các trường null nếu thiếu
            const requiredFields = [
                'venue_id', 'referee_id', 'related_id', 'agg_score'
            ];
            
            for (const field of requiredFields) {
                if (!decompressed.hasOwnProperty(field)) {
                    decompressed[field] = null;
                }
            }

            return decompressed;
        });

        // Tạo object giải nén cuối cùng
        const finalDecompressed = {
            [query]: decompressedEvents
        };

        // Lưu file giải nén
        const decompressedJSON = JSON.stringify(finalDecompressed, null, 2);
        await fs.writeFile(outputFile, decompressedJSON);

        // Tính toán và hiển thị thống kê
        const compressedSize = Buffer.byteLength(compressedData, 'utf8');
        const decompressedSize = Buffer.byteLength(decompressedJSON, 'utf8');

        console.log(`Kích thước file nén: ${formatSize(compressedSize)}`);
        console.log(`Kích thước sau giải nén: ${formatSize(decompressedSize)}`);
        console.log('Giải nén thành công!');
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Hàm format kích thước file
function formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Sử dụng
decompressJSON('compressed.json', 'decompressed.json')
    .then(() => console.log('Hoàn tất!'))
    .catch(console.error);