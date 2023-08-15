const Expense = require('../models/expense');
const User = require('../models/user');
const { DateTime, Info } = require('luxon')

module.exports.get = async (req, res) => {
    try {
        let limit = 10
        let skip = 0
        let where = { user: req.user.userId }
        if(req.query.q) where['description'] = { $regex: new RegExp(req.query.q, 'i') }
        if(req.query.category) where['category'] = req.query.category
        if(req.query.page) skip = Number(req.query.page) * limit

        const expenses = await Expense.find(where)
                                .populate("category")
                                .sort({ date: -1 })
                                .skip(skip)
                                .limit(limit);

        const count = await Expense.countDocuments(where)

        res.send({ expenses, pages: Math.ceil(count/limit) });
    } catch (error) {
        res.status(500).json({ error: 'Error getting expenses' });
    }
}

module.exports.analysisChart = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user.userId })
        if(!user) return res.status(404).send({ error: "Invalid User." });

        const today = DateTime.local();
        let prevData = []
        let thisData = []
        let labels = []
        let prevLabel = ""
        let thisLabel = ""
        let prevTotal = 0
        let thisTotal = 0

        // {
        //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        //     datasets: [
        //         {
        //             label: 'Users',
        //             data: [NaN, 120, 2000, 2398, 1583, 100, 1723],
        //             borderColor: 'rgb(255, 99, 132)',
        //             backgroundColor: 'rgba(255, 99, 132, 0.5)',
        //         },
        //         {
        //             label: 'Plays',
        //             data: [120, 100, 1723, 2000, 2398, 1583, 588, 1287],
        //             borderColor: 'rgb(53, 162, 235)',
        //             backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //         },
        //     ],
        // }

        if(user.yearly_view) {
            const lastYear = today.minus({ years: 1 });
            prevLabel = lastYear.toFormat('yyyy')
            thisLabel = today.toFormat('yyyy')
    
            let thisYearData = await Expense.aggregate([
                    {
                        $match: {
                            user: user._id,
                            date: {
                                $gte: today.startOf('year').toJSDate(),
                                $lt: today.endOf('year').toJSDate(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { month: { $month: '$date' } },
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ])
            
            let prevYearData = await Expense.aggregate([
                    {
                        $match: {
                            user: user._id,
                            date: {
                                $gte: lastYear.startOf('year').toJSDate(),
                                $lt: lastYear.endOf('year').toJSDate(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { month: { $month: '$date' } },
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ])
            
            thisData = Array.from({ length: 12 }, (_, i) =>
                thisYearData.find(item => item._id.month === i + 1)?.totalAmount || 0
            );
    
            prevData = Array.from({ length: 12 }, (_, i) =>
                prevYearData.find(item => item._id.month === i + 1)?.totalAmount || 0
            );

            labels = Info.months('long')
        } else {
            const lastMonth = today.minus({ months: 1 });
            prevLabel = lastMonth.toFormat('LLL yyyy')
            thisLabel = today.toFormat('LLL yyyy')
    
            let thisMonthData = await Expense.aggregate([
                    {
                        $match: {
                            user: user._id,
                            date: {
                                $gte: today.startOf('month').toJSDate(),
                                $lt: today.endOf('month').toJSDate(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfMonth: '$date' },
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ])
            
            let prevMonthData = await Expense.aggregate([
                    {
                        $match: {
                            user: user._id,
                            date: {
                                $gte: lastMonth.startOf('month').toJSDate(),
                                $lt: lastMonth.endOf('month').toJSDate(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfMonth: '$date' },
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ])
            
            thisData = Array.from({ length: today.daysInMonth }, (_, i) =>
                thisMonthData.find(item => item._id === i + 1)?.totalAmount || 0
            );
    
            prevData = Array.from({ length: lastMonth.daysInMonth }, (_, i) =>
                prevMonthData.find(item => item._id === i + 1)?.totalAmount || 0
            );

            let totalDays = today.daysInMonth
            if(lastMonth.daysInMonth > totalDays) totalDays = lastMonth.daysInMonth

            labels = Array.from({ length: totalDays }, (_, i) => i + 1);
        }

        prevTotal = prevData.reduce((sum, amount) => sum + amount, 0);
        thisTotal = thisData.reduce((sum, amount) => sum + amount, 0);

        res.send({
            chart: {
                labels,
                datasets: [
                    {
                        label: prevLabel,
                        data: prevData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: thisLabel,
                        data: thisData,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            },
            prevData: {
                label: prevLabel,
                value: prevTotal
            },
            thisData: {
                label: thisLabel,
                value: thisTotal
            }
        });
    } catch(err) {
        res.status(500).json({ error: 'Error getting expenses analysis' });
    }
}

module.exports.create = async (req, res) => {
    try {
        req.body.user = req.user.userId
        const expense = new Expense(req.body);
        await expense.save();
        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error creating expense' });
    }
}

module.exports.update = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id });
        if(!expense) return res.status(404).json({ error: 'Expense not found' });

        await Expense.findOneAndUpdate({ _id: req.params.id }, req.body)

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error updating expense' });
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Expense.deleteOne({ _id: req.params.id })

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting expense' });
    }
}