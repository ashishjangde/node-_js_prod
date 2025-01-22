import { Router } from "express";
import { signup } from "../controller/auth.controller";

const router = Router();


router.post('/signup', signup);

router.get('/helo',(req, res)=>{
    res.json({message: 'Hello World'});
})
export default router;