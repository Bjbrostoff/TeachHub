/**
 * Created by Administrator on 2016/1/15.
 */
exports.dayInfo = function (req, res) {
    res.json([
        {
            day: '星期一',
            detail:[
                {
                name:'商务英语1',
                students:['学生A1','学生B1','学生C1','学生D1','学生E1','学生F1']
            },
                {
                name:'商务英语2',
                students:['学生A2','学生B2','学生C2','学生D2','学生E2','学生F2']
            }
            ],
        },
        {
            day: '星期二',
            detail:[
                {
                    name:'计算机',
                    students:['学生W1','学生W2','学生W3']
            }
            ]
        }
    ]);
}