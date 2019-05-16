import { IPoint, IRect, IDocOptions } from './doc_controller';
import { IPdfBrick, PdfBrick } from './pdf_render/pdf_brick';

export class TestHelper {
    static MM_TO_PT = 72 / 25.4;
    static get defaultPoint(): IPoint {
        return {
            xLeft: 10 * this.MM_TO_PT,
            yTop: 10 * this.MM_TO_PT
        }
    }
    static get defaultRect(): IRect {
        return {
            xLeft: 10 * this.MM_TO_PT,
            xRight: 20 * this.MM_TO_PT,
            yTop: 10 * this.MM_TO_PT,
            yBot: 20 * this.MM_TO_PT
        }
    }
    static get defaultOptions(): IDocOptions {
        return {
            fontSize: 30,
            margins: {
                marginLeft: 10 * this.MM_TO_PT,
                marginRight: 10 * this.MM_TO_PT,
                marginTop: 10 * this.MM_TO_PT,
                marginBot: 10 * this.MM_TO_PT
            }
        };
    }
    static wrapRect(rect: IRect): IPdfBrick {
        return new PdfBrick(null, null, rect);
    }
    static wrapRects(rects: IRect[]): IPdfBrick[] {
        let pdfqs: IPdfBrick[] = new Array();
        rects.forEach((rect: IRect) => {
            pdfqs.push(TestHelper.wrapRect(rect));
        });
        return pdfqs;
    }
    static wrapRectsPage(rects: IRect[]): IPdfBrick[][] {
        return [TestHelper.wrapRects(rects)];
    }
    static equalRects(expect: any, rects1: IRect[], rects2: IRect[]) {
        for (let i = 0; i < rects1.length; i++) {
            this.equalRect(expect, rects1[i], rects2[i]);
        }
    }
    static equalRect(expect: any, rect1: IRect, rect2: IRect) {
        expect(rect1.xLeft).toBeCloseTo(rect2.xLeft);
        expect(rect1.xRight).toBeCloseTo(rect2.xRight);
        expect(rect1.yTop).toBeCloseTo(rect2.yTop);
        expect(rect1.yBot).toBeCloseTo(rect2.yBot);
    }
    static equalPoint(expect: any, point1: IPoint, point2: IPoint) {
        expect(point1.xLeft).toBeCloseTo(point2.xLeft);
        expect(point1.yTop).toBeCloseTo(point2.yTop);
    }
}