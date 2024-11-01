const mongoose=require('mongoose')
const initdata=require('./data.js')
const Listing=require('../model/listing.js')


const Monogo_url='mongodb://127.0.0.1:27017/wonderlust'

main().then(()=>{
    console.log('Connected to the Db')
}).catch(err=>{
    console.log(err)
})
async function main(){
   await mongoose.connect(Monogo_url)
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((odj)=>({
        ...odj,
        owner:"671a504652b278e3767607d4"
      
    }))
    await Listing.insertMany(initdata.data);
    console.log('data was intilize')

}

initDB();
