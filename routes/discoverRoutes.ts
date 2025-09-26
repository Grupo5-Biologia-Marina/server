import { Request, Response } from "express";


// POST
export const createDiscover = async (req: Request, res: Response): Promise<void> => { //no devuelve nada solo envía respuesta
    try{
        const discoverData: CreateDiscoverDto = req.body; //extraemos los datos del body de la peticion post
        const discover = new discoverModel({ 
            ...discoverData,
            status: DiscoverStatus.DRAFT,
            publishedDate: new Date()
        });
        await discover.save(); //se guarda el post en mongo
        const response: ApiResponse<IDiscoverResponse> = { //creamos la respuesta exitosa
            success: true, //inidica si la operacion fue exitosa
            data: discover.toJSON(), //convertimos a JSON
            message: 'Discovery created successfully'
        };
        res.status(201).json(response); //enviamos la respuesta http con los datos
    } catch (error) {
        console.error('Error creating discovery:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message); //extraemos todos los mensajes de validación
            res.status(400).json({
                success: false,
                message: 'Validation error',
                error: validationErrors.join(',') // unimos los errores
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Server error while creating discovery',
            error: error.message
        });
    }
};

//GET