(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { Question } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { TextBrick } from '../src/pdf_render/pdf_text';
import { CompositeBrick } from '../src/pdf_render/pdf_composite';
import { RowlineBrick } from '../src/pdf_render/pdf_rowline';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null, null);
let __dummy_cb = new FlatCheckbox(null, null, null);

export async function calcTitleTop(leftTopPoint: IPoint, controller: DocController,
    titleQuestion: Question, compositeFlat: IPdfBrick, isDesc: boolean = false): Promise<IPoint> {
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        leftTopPoint, titleQuestion, controller);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    if (isDesc) {
        let descPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
        descPoint.xLeft += controller.unitWidth;
        descPoint.yTop += FlatQuestion.DESC_GAP_SCALE * controller.unitHeight;
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            descPoint, null, controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        assumeTextbox = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(assumeDesc), controller);
        assumeTextbox.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTextbox.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc, assumeTextbox));
    }
    else {
        assumeTextbox.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTextbox.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeTextbox));
    }
    return SurveyHelper.createPoint(assumeTextbox);
}
async function calcTitleBottom(controller: DocController, titleQuestion: Question,
    titleFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        SurveyHelper.createPoint(assumeTextbox), titleQuestion, controller);
    assumeTextbox.xLeft += controller.unitWidth;
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    if (isDesc) {
        let descPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
        descPoint.xLeft += controller.unitWidth;
        descPoint.yTop += controller.unitHeight * FlatQuestion.DESC_GAP_SCALE;
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            descPoint, null, controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        assumeTitle.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTitle.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeDesc.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeDesc.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, titleFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc));
    } else {
        assumeTitle.yTop += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        assumeTitle.yBot += controller.unitHeight *
            FlatQuestion.CONTENT_GAP_VERT_SCALE;
        TestHelper.equalRect(expect, titleFlat, assumeTitle);
    }
}
async function calcTitleLeft(controller: DocController, titleQuestion: Question,
    compositeFlat: IPdfBrick, textboxFlat: IPdfBrick, isDesc: boolean = false) {
    let oldRightMargins = controller.margins.right;
    controller.margins.right = controller.paperWidth - controller.margins.left -
        SurveyHelper.getPageAvailableWidth(controller)
        * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
    let assumeTitle: IRect = await SurveyHelper.createTitleFlat(
        controller.leftTopPoint, titleQuestion, controller);
    controller.margins.right = oldRightMargins;
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    if (isDesc) {
        controller.margins.right = controller.paperWidth - controller.margins.left -
            SurveyHelper.getPageAvailableWidth(controller)
            * SurveyHelper.MULTIPLETEXT_TEXT_PERS;
        let descPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
        descPoint.xLeft += controller.unitWidth;
        descPoint.yTop += controller.unitHeight * FlatQuestion.DESC_GAP_SCALE;
        let assumeDesc: IRect = await SurveyHelper.createDescFlat(
            descPoint, null, controller, SurveyHelper.getLocString(
                titleQuestion.locDescription));
        controller.margins.right = oldRightMargins;
        TestHelper.equalRect(expect, compositeFlat,
            SurveyHelper.mergeRects(assumeTitle, assumeDesc));
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    else {
        TestHelper.equalRect(expect, compositeFlat, assumeTitle);
    }
    assumeTextbox.xLeft += controller.unitWidth *
        FlatQuestion.CONTENT_GAP_HOR_SCALE;
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}
export async function calcIndent(expect: any, leftTopPoint: IPoint, controller: DocController,
    compositeFlat: IPdfBrick, checktext: string, titleQuestion: Question = null): Promise<void> {
    let assumeTitle: IRect = SurveyHelper.createRect(leftTopPoint, 0.0, 0.0);
    if (titleQuestion != null) {
        assumeTitle = await SurveyHelper.createTitleFlat(leftTopPoint, titleQuestion, controller);
    }
    let itemHeight: number = controller.unitHeight;
    let assumeCheckbox: IRect = SurveyHelper.moveRect(SurveyHelper.scaleRect(
        SurveyHelper.createRect(SurveyHelper.createPoint(assumeTitle),
            itemHeight, itemHeight), SurveyHelper.SELECT_ITEM_FLAT_SCALE),
        leftTopPoint.xLeft + controller.unitWidth);
    let textPoint: IPoint = SurveyHelper.createPoint(assumeTitle);
    textPoint.xLeft = assumeCheckbox.xRight + controller.unitWidth * SurveyHelper.GAP_BETWEEN_ITEM_TEXT;
    let assumeChecktext: IRect = await SurveyHelper.createTextFlat(textPoint,
        null, controller, checktext, TextBrick);
    assumeCheckbox.yTop += controller.unitHeight *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeCheckbox.yBot += controller.unitHeight *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeChecktext.yTop += controller.unitHeight *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    assumeChecktext.yBot += controller.unitHeight *
        FlatQuestion.CONTENT_GAP_VERT_SCALE;
    TestHelper.equalRect(expect, compositeFlat,
        SurveyHelper.mergeRects(assumeTitle, assumeCheckbox, assumeChecktext));
}
test('Calc textbox boundaries title top', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries title bottom', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0]);
});
test('Calc textbox boundaries title left', async () => {
    let json: any = {
        showQuestionNumbers: "false",
        questions: [
            {
                type: 'text',
                name: 'textbox left bound',
                title: 'Title',
                titleLocation: 'left'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(controller, <Question>survey.getAllQuestions()[0],
        flats[0][0].unfold()[0], flats[0][0].unfold()[1]);
});
test('Calc textbox boundaries title hidden', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let contentPoint: IPoint = controller.leftTopPoint;
    contentPoint.xLeft += controller.unitWidth;
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        contentPoint, controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});
test('Calc boundaries with space between questions', async () => {
    let json: any = {
        questions: [{
            type: 'text',
            name: 'textbox1',
            title: 'What have we here?'
        },
        {
            type: 'text',
            name: 'textbox2',
            title: 'Space between questions!'
        }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
    let title2point: IPoint = await calcTitleTop(controller.leftTopPoint,
        controller, <Question>survey.getAllQuestions()[0], flats[0][0]);
    title2point.yTop += controller.unitHeight * FlatSurvey.QUES_GAP_VERT_SCALE;
    expect(flats[0][1] instanceof RowlineBrick).toBe(true);
    await calcTitleTop(title2point, controller,
        <Question>survey.getAllQuestions()[1], flats[0][2]);
});
test('Calc textbox boundaries title without number', async () => {
    let json: any = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc textbox boundaries required', async () => {
    let json: any = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0]);
});
test('Calc boundaries title top longer than description', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'My title is so interesting',
                description: 'But the description is not enough'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title top shorter than description', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Tiny title',
                description: 'The description is so long, very long, very'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleTop(controller.leftTopPoint, controller,
        <Question>survey.getAllQuestions()[0], flats[0][0], true);
});
test('Calc boundaries title bottom longer than description', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'What a gorgeous title',
                titleLocation: 'bottom',
                description: 'Who reads the descriptions?'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title bottom shorter than description', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Piece of title',
                titleLocation: 'bottom',
                description: 'Very important information: required to read'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    await calcTitleBottom(controller, <Question>survey.getAllQuestions()[0],
        flats[0][1], flats[0][0], true);
});
test('Calc boundaries title left longer than description', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Pain',
                titleLocation: 'left',
                description: 'pan'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title left shorter than description', async () => {
    let json: any = {
        showQuestionNumbers: 'false',
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'A',
                titleLocation: 'left',
                description: 'Major Pain'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    await calcTitleLeft(controller, <Question>survey.getAllQuestions()[0],
        new CompositeBrick(flats[0][0].unfold()[0], flats[0][0].unfold()[1]),
        flats[0][0].unfold()[2], true);
});
test('Calc boundaries title hidden with description', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Ninja',
                titleLocation: 'hidden',
                description: 'Under cover of night'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let contentPoint: IPoint = controller.leftTopPoint;
    contentPoint.xLeft += controller.unitWidth;
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        contentPoint, controller);
    TestHelper.equalRect(expect, flats[0][0], assumeTextbox);
});
test('Calc boundaries with indent', async () => {
    for (let i: number = 0; i < 9; i++) {
        let json: any = {
            questions: [
                {
                    type: 'checkbox',
                    name: 'checkbox_cycle_indent',
                    title: 'I stand straight',
                    indent: i,
                    choices: [
                        'Right choice'
                    ]
                }
            ]
        };
        let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
        let controller: DocController = new DocController(TestHelper.defaultOptions);
        let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
        expect(flats.length).toBe(1);
        expect(flats[0].length).toBe(1);
        let leftTopPoint: IPoint = controller.leftTopPoint;
        leftTopPoint.xLeft += controller.measureText(i).width;
        await calcIndent(expect, leftTopPoint, controller,
            flats[0][0], json.questions[0].choices[0],
            <Question>survey.getAllQuestions()[0]);
    }
});
test('Not visible question and visible question', async () => {
    let json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                visible: false
            },
            {
                type: 'checkbox',
                name: 'box',
                visible: true
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let rects: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let assumeRect = [];
    assumeRect[0] = await SurveyHelper.createTitleFlat(TestHelper.defaultPoint,
        <Question>survey.getAllQuestions()[1], controller);
    TestHelper.equalRects(expect, rects[0], assumeRect)
});
test('VisibleIf row', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'Look at visible me'
            },
            {
                type: 'text',
                name: 'Please! Don\'t look!',
                visibleIf: 'false'
            },
            {
                type: 'text',
                name: 'I\'m here'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(3);
});
test('Check title with number next raw position', async () => {
    let json: any = {
        questions: [
            {
                type: 'checkbox',
                name: 'Eeeeeeeeeemmmmmmmmmmmptttttyyyy chhhheeeckbox',
                isRequired: false
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let noWidth: number = controller.measureText('1. ').width *
        SurveyHelper.TITLE_FONT_SCALE;
    let bricks: IPdfBrick[] = flats[0][0].unfold();
    expect(SurveyHelper.mergeRects(bricks[1], bricks[2]).xLeft).
        toBeCloseTo(controller.leftTopPoint.xLeft + noWidth);
});
test('Check equality of margins.left and contentPoint.xLeft with titleLocation: left', async () => {
    var json: any = {
        questions: [
            {
                type: 'checkbox',
                choices: [
                    '', ''
                ],
                titleLocation: 'left',
                colCount: 0,
                title: 'Sex'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    let contentAssumePointLeft: number = SurveyHelper.createPoint(
        await SurveyHelper.createTitleFlat(controller.leftTopPoint,
        <Question>survey.getAllQuestions()[0], controller), false, true).xLeft;
    contentAssumePointLeft += controller.unitWidth;
    expect(flats[0][0].unfold()[2].xLeft).toBe(contentAssumePointLeft);
});
test('Check questions width with startWithNewLine: false property', async () => {
    let json: any = {
        questions: [
            {
                type: 'text',
                name: 'startWithNewLineFlase1',
                titleLocation: 'hidden',
                startWithNewLine: 'false'
            },
            {
                type: 'text',
                name: 'startWithNewLineFlase2',
                titleLocation: 'hidden',
                startWithNewLine: 'false',
                width: '15%'
            },
            {
                type: 'text',
                name: 'startWithNewLineFlase3',
                titleLocation: 'hidden',
                startWithNewLine: 'false'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    let resultFlats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey, controller);
    expect(resultFlats.length).toBe(1);
    expect(resultFlats[0].length).toBe(3);
    let currPoint: IPoint = controller.leftTopPoint;
    let width: number = SurveyHelper.getPageAvailableWidth(controller) - 2.0 * controller.unitWidth;
    let assumeFlats: IRect[] = [];
    currPoint.xLeft += controller.unitWidth;
    controller.margins.left = currPoint.xLeft;
    assumeFlats.push(SurveyHelper.createRect(currPoint, 1.0 / 3.0 * width - controller.unitWidth, controller.unitHeight));
    currPoint.xLeft = assumeFlats[0].xRight + 2.0 * controller.unitWidth;
    controller.margins.left = currPoint.xLeft;
    assumeFlats.push(SurveyHelper.createRect(currPoint, 0.15 * width - controller.unitWidth, controller.unitHeight));
    currPoint.xLeft = assumeFlats[1].xRight + 2.0 * controller.unitWidth;
    controller.margins.left = currPoint.xLeft;
    assumeFlats.push(SurveyHelper.createRect(currPoint, 1.0 / 3.0 * width - controller.unitWidth, controller.unitHeight));
    TestHelper.equalRects(expect, resultFlats[0], assumeFlats);
});