import CountDown from "../models/countdown.js";

const createCountDown = async(req, res) => {
    const user = req.user;
    const { title, date, backgroundImage } = req.body;
    const newCountDown = new CountDown({
        title,
        date,
        backgroundImage,
        user: user._id,
    });
    console.log(title, date, backgroundImage, user)
    try {
        const countDown = await newCountDown.save();
        res.json(countDown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCountDowns = async(req, res) => {
    const user_id = req.user._id;
    const { page, pageSize } = req.query;
    const skip = (page - 1) * pageSize;

    try {

        const [countDowns, count] = await Promise.all([
            CountDown.find({ user: user_id })
            .select('-backgroundImage')
            .skip(skip)
            .limit(pageSize),
            CountDown.countDocuments({ user: user_id })
        ]);
        res.json({ list: countDowns, count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCountDown = async(req, res) => {
    const { id } = req.params;
    try {
        const countDown = await CountDown.findById(id);
        res.json(countDown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCountDown = async(req, res) => {
    const { id } = req.params;
    const { title, date, backgroundImage } = req.body;
    const updatedCountDown = {
        title,
        date,
        backgroundImage,
    };
    try {
        const response = await CountDown.findByIdAndUpdate(id, updatedCountDown);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCountDown = async(req, res) => {
    const { id } = req.params;
    try {
        const deletedCountDown = await CountDown.findByIdAndDelete(id);
        res.json(deletedCountDown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createCountDown,
    getCountDowns,
    getCountDown,
    updateCountDown,
    deleteCountDown,
};