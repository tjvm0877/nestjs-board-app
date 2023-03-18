import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/Create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    // getAllBoards(): Board[] {
    //     return this.boards;
    // }
    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

    async createBoard(createBoardDto: CreateBoardDto) : Promise<Board> {
        const {title, description} = createBoardDto;

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC
        })
        
        await this.boardRepository.save(board);
        return board
    }

    async getBoardById(id: number): Promise <Board> {
        const found = await this.boardRepository.findOne({
            where: {
                id: id,
            }
        });

        if(!found) {
            throw new NotFoundException(`해당 아이디(${id})의 게시물이 존재하지 않습니다.`);
        }

        return found
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException('해당 아이디의 게시물을 찾을 수 없습니다.');
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardRepository.save(board);
        return board;
    }
    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }
}
